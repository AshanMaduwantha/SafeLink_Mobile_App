import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import type { Credentials } from "@aws-sdk/types";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import Config from "react-native-config";
import RNFS from "react-native-fs";

// @ts-expect-error - Polyfill for React Native
if (typeof global.ReadableStream === "undefined") {
  // @ts-expect-error - Polyfill for React Native
  global.ReadableStream = class ReadableStream {
    constructor() {}
  };
}

interface S3Options {
  keyPrefix: string;
  bucket: string;
  region: string;
  successActionStatus: number;
}

const getFileType = (path: string): string => {
  const extension = path.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
  };
  return mimeTypes[extension || ""] || "image/jpeg";
};

// Generate file name using user UUID
const generateFileName = (originalPath: string, userId: string): string => {
  const extension = originalPath.split(".").pop()?.toLowerCase() || "jpg";
  return `${userId}.${extension}`;
};

// Extract S3 key from photoURL
const extractS3KeyFromUrl = (
  photoURL: string,
  bucket: string,
  region: string,
): string | null => {
  try {
    const urlPattern = new RegExp(
      `https://${bucket}\\.s3\\.${region}\\.amazonaws\\.com/(.+)`,
    );
    const match = photoURL.match(urlPattern);
    if (match && match[1]) {
      return match[1];
    }

    // Try alternative format
    const altPattern = new RegExp(
      `https://s3\\.${region}\\.amazonaws\\.com/${bucket}/(.+)`,
    );
    const altMatch = photoURL.match(altPattern);
    if (altMatch && altMatch[1]) {
      return altMatch[1];
    }

    return null;
  } catch (error) {
    console.error("Error extracting S3 key from URL:", error);
    return null;
  }
};

const options: S3Options = {
  keyPrefix: Config.S3_DANCEY_MAIN_PROFILE_PATH || "uploads/",
  bucket: Config.S3_DANCEY_MAIN_BUCKET_NAME || "",
  region: Config.S3_REGION || "eu-central-1",
  successActionStatus: 201,
};

const credentials: Credentials = {
  accessKeyId: Config.S3_ACCESS_KEY_ID || "",
  secretAccessKey: Config.S3_SECRET_ACCESS_KEY || "",
};

const client = new S3Client({
  region: options.region,
  credentials: credentials,
});

const S3Service = {
  //Delete image from S3 bucket
  deleteImage: async function (photoURL: string): Promise<void> {
    try {
      const s3Key = extractS3KeyFromUrl(
        photoURL,
        options.bucket,
        options.region,
      );

      if (!s3Key) {
        console.warn("Could not extract S3 key from URL:", photoURL);
        return;
      }

      if (!s3Key.startsWith(options.keyPrefix)) {
        console.warn(
          "Image is not in profile images path, skipping delete:",
          s3Key,
        );
        return;
      }

      const command = new DeleteObjectCommand({
        Bucket: options.bucket,
        Key: s3Key,
      });

      await client.send(command);
    } catch (error: any) {
      console.error("Error deleting image from S3:", error);
    }
  },

  // Upload image file to S3
  uploadImage: async function (
    fileUri: string,
    userId: string,
  ): Promise<string> {
    try {
      let filePath = fileUri;

      if (filePath.startsWith("file://")) {
        filePath = filePath.replace(/^file:\/\//, "");
      }

      // Read file as base64
      let base64Data: string;

      if (fileUri.startsWith("content://")) {
        try {
          base64Data = await RNFS.readFile(fileUri, "base64");
        } catch {
          const tempPath = `${RNFS.CachesDirectoryPath}/temp_${Date.now()}.jpg`;
          await RNFS.copyFile(fileUri, tempPath);
          base64Data = await RNFS.readFile(tempPath, "base64");
          await RNFS.unlink(tempPath).catch(() => {});
        }
      } else {
        base64Data = await RNFS.readFile(filePath, "base64");
      }

      if (!base64Data) {
        throw new Error("Failed to read file data");
      }

      // Convert base64 to Uint8Array for AWS SDK
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Generate unique file name
      const fileName = generateFileName(fileUri, userId);
      const key = `${options.keyPrefix}${fileName}`;

      const command = new PutObjectCommand({
        Bucket: options.bucket,
        Key: key,
        Body: bytes.buffer ? bytes : new Uint8Array(bytes),
        ContentType: getFileType(fileUri),
      });

      await client.send(command);

      // Return S3 URL
      const s3Url = `https://${options.bucket}.s3.${options.region}.amazonaws.com/${key}`;
      return s3Url;
    } catch (error: any) {
      console.error("S3 Upload Error:", error);
      throw error;
    }
  },
};

export default S3Service;
