import axios from "axios";

// NOTE: For production, you should generate tokens on your backend.
// This is a placeholder. You can get a temporary token from VideoSDK Dashboard.
export const VIDEOSDK_TOKEN: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJhcGlrZXkiOiJiYjkzOGI2MC0wNjRiLTQzYTktYWE4NC0wOThmY2MyZTM5YzkiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0s" +
  "InJvbGVzIjpbInJ0YyJdLCJpYXQiOjE3Njc0NzQxMzMsImV4cCI6MTc5OTAxMDEzM30." +
  "C4LljOPx3WoBFuXcqRjhJ1PfliLO78romTsZM70wc_k";

/**
 * Creates a new meeting.
 * @returns {Promise<string>} The meetingId.
 */
export const createMeeting = async ({
  token,
}: {
  token: string;
}): Promise<string> => {
  try {
    const res = await axios.post(
      "https://api.videosdk.live/v2/rooms",
      {},
      {
        headers: {
          authorization: `${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const { roomId } = res.data;
    return roomId;
  } catch (error: any) {
    const data = error?.response?.data;
    const message = data?.message || data?.error || error.message;
    console.error("VideoSDK API Error:", message, data);
    throw new Error(message);
  }
};
