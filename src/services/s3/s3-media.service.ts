import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import Config from "react-native-config";

export type MediaType = "image" | "video" | "unknown";

export interface MediaItem {
  key: string;
  url?: string;
  mediaType: MediaType;
  size?: number;
  lastModified?: Date;
  name: string;
}

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "heic", "heif"];
const VIDEO_EXTENSIONS = ["mp4", "mov", "avi", "mkv", "webm", "m4v", "3gp"];

const getMediaType = (key: string): MediaType => {
  const ext = key.split(".").pop()?.toLowerCase() || "";
  if (IMAGE_EXTENSIONS.includes(ext)) return "image";
  if (VIDEO_EXTENSIONS.includes(ext)) return "video";
  return "unknown";
};

const bucket = Config.S3_BUCKET_NAME || "women-and-children";
const region = Config.S3_REGION || "eu-north-1";

const s3MediaClient = new S3Client({
  region,
  credentials: {
    accessKeyId: Config.S3_ACCESS_KEY_ID || "",
    secretAccessKey: Config.S3_SECRET_ACCESS_KEY || "",
  },
});

const S3MediaService = {
  /**
   * List all media objects in the bucket, optionally filtered by a key prefix.
   */
  listMedia: async (prefix?: string): Promise<MediaItem[]> => {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: 200,
    });

    const response = await s3MediaClient.send(command);
    const contents = response.Contents || [];

    return contents
      .filter((obj) => obj.Key && !obj.Key.endsWith("/"))
      .map((obj) => ({
        key: obj.Key!,
        mediaType: getMediaType(obj.Key!),
        size: obj.Size,
        lastModified: obj.LastModified,
        name: obj.Key!.split("/").pop() || obj.Key!,
      }));
  },

  /**
   * Generate a time-limited pre-signed URL for private S3 objects.
   * Default expiry: 1 hour.
   */
  getPresignedUrl: async (key: string, expiresIn = 3600): Promise<string> => {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    return getSignedUrl(s3MediaClient, command, { expiresIn });
  },

  /**
   * Build a direct public URL (only works if bucket/object has public-read ACL).
   */
  getPublicUrl: (key: string): string =>
    `https://${bucket}.s3.${region}.amazonaws.com/${key}`,

  /**
   * Fetch the full media list and attach presigned URLs to each item.
   */
  loadMediaWithUrls: async (prefix?: string): Promise<MediaItem[]> => {
    const items = await S3MediaService.listMedia(prefix);

    const itemsWithUrls = await Promise.allSettled(
      items.map(async (item) => {
        const url = await S3MediaService.getPresignedUrl(item.key);
        return { ...item, url };
      }),
    );

    return itemsWithUrls
      .filter(
        (result): result is PromiseFulfilledResult<MediaItem> =>
          result.status === "fulfilled",
      )
      .map((result) => result.value);
  },
};

export default S3MediaService;
