/**
 * Voice Notes Service
 *
 * Handles voice note recording upload and management
 */

import apiClient from "../api/api-client";
import Config from "react-native-config";
import RNFS from "react-native-fs";

export interface VoiceNote {
  id: string;
  user_id: string;
  audio_url: string;
  duration_seconds: number;
  title: string | null;
  description: string | null;
  is_listened: boolean;
  listened_at: string | null;
  created_at: string;
}

export interface CreateVoiceNoteResponse {
  success: boolean;
  data: VoiceNote;
}

export interface PresignedUrlResponse {
  success: boolean;
  presignedUrl: string;
  finalUrl: string;
  key: string;
}

export interface UploadProgressCallback {
  (progress: number): void;
}

const voiceNotesService = {
  /**
   * Get presigned URL for uploading voice note to S3
   */
  getPresignedUrl: async (
    fileName: string,
    fileType: string,
    userId: string
  ): Promise<PresignedUrlResponse> => {
    return apiClient.post<PresignedUrlResponse>("/api/s3-upload/voice-note", {
      fileName,
      fileType,
      userId,
    });
  },

  /**
   * Upload voice note file to S3 using presigned URL
   */
  uploadToS3: async (
    presignedUrl: string,
    filePath: string,
    fileType: string,
    onProgress?: UploadProgressCallback
  ): Promise<boolean> => {
    try {
      // Read file as base64
      let base64Data: string;
      let normalizedPath = filePath;

      if (normalizedPath.startsWith("file://")) {
        normalizedPath = normalizedPath.replace(/^file:\/\//, "");
      }

      if (filePath.startsWith("content://")) {
        try {
          base64Data = await RNFS.readFile(filePath, "base64");
        } catch {
          const tempPath = `${RNFS.CachesDirectoryPath}/temp_audio_${Date.now()}.m4a`;
          await RNFS.copyFile(filePath, tempPath);
          base64Data = await RNFS.readFile(tempPath, "base64");
          await RNFS.unlink(tempPath).catch(() => {});
        }
      } else {
        base64Data = await RNFS.readFile(normalizedPath, "base64");
      }

      if (!base64Data) {
        throw new Error("Failed to read audio file data");
      }

      // Convert base64 to binary for upload
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Upload using fetch with PUT method to presigned URL
      const response = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": fileType,
        },
        body: bytes,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error uploading voice note to S3:", error);
      throw error;
    }
  },

  /**
   * Create voice note record in database
   */
  createVoiceNote: async (
    userId: string,
    audioUrl: string,
    durationSeconds: number,
    title?: string,
    description?: string
  ): Promise<CreateVoiceNoteResponse> => {
    return apiClient.post<CreateVoiceNoteResponse>("/api/voice-notes", {
      userId,
      audioUrl,
      durationSeconds,
      title,
      description,
    });
  },

  /**
   * Full upload flow: get presigned URL, upload to S3, create database record
   */
  uploadVoiceNote: async (
    userId: string,
    filePath: string,
    durationSeconds: number,
    title?: string,
    description?: string,
    onProgress?: UploadProgressCallback
  ): Promise<VoiceNote> => {
    try {
      // Extract file name from path
      const fileName = filePath.split("/").pop() || `voice_note_${Date.now()}.m4a`;
      const fileType = "audio/m4a";

      // Step 1: Get presigned URL
      onProgress?.(10);
      const presignedResponse = await voiceNotesService.getPresignedUrl(
        fileName,
        fileType,
        userId
      );

      if (!presignedResponse.success) {
        throw new Error("Failed to get upload URL");
      }

      // Step 2: Upload to S3
      onProgress?.(30);
      await voiceNotesService.uploadToS3(
        presignedResponse.presignedUrl,
        filePath,
        fileType,
        (progress) => {
          // Map S3 upload progress to 30-80%
          onProgress?.(30 + Math.round(progress * 0.5));
        }
      );

      // Step 3: Create database record
      onProgress?.(85);
      const createResponse = await voiceNotesService.createVoiceNote(
        userId,
        presignedResponse.finalUrl,
        durationSeconds,
        title,
        description
      );

      if (!createResponse.success) {
        throw new Error("Failed to create voice note record");
      }

      onProgress?.(100);
      return createResponse.data;
    } catch (error) {
      console.error("Error in uploadVoiceNote:", error);
      throw error;
    }
  },
};

export default voiceNotesService;
