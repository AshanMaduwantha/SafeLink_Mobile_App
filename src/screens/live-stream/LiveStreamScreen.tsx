import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ChannelProfileType,
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  RtcSurfaceView,
} from "react-native-agora";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// TODO: Move to environment variables
const AGORA_APP_ID = "7df716494b734dfdb300208f2caabce2";
const DEFAULT_CHANNEL = "live_stream_channel";

const LiveStreamScreen = ({ route }: any) => {
  const { meetingId } = route.params || {};
  const channelName = meetingId || DEFAULT_CHANNEL;

  const [engine, setEngine] = useState<IRtcEngine | null>(null);
  const [joined, setJoined] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [uid, setUid] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    initializeAgora();
    return () => {
      cleanupAgora();
    };
  }, []);

  const initializeAgora = async () => {
    try {
      console.log("🔧 Initializing Agora SDK...");

      // Request permissions on Android
      if (Platform.OS === "android") {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
      }

      // Create Agora engine
      const agoraEngine = createAgoraRtcEngine();

      // Initialize the engine
      agoraEngine.initialize({
        appId: AGORA_APP_ID,
      });

      // Enable video
      agoraEngine.enableVideo();

      // Set up event handlers
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: (connection) => {
          console.log(" Joined channel:", connection.channelId);
          setJoined(true);
          setUid(connection.localUid ?? 0);
        },
        onUserJoined: (_connection, remoteUid) => {
          console.log("👤 Remote user joined:", remoteUid);
        },
        onUserOffline: (_connection, remoteUid, _reason) => {
          console.log("👤 Remote user left:", remoteUid);
        },
        onError: (err, msg) => {
          console.error("Agora error:", err, msg);
        },
      });

      // Set channel profile
      agoraEngine.setChannelProfile(
        ChannelProfileType.ChannelProfileLiveBroadcasting,
      );

      // Set client role to broadcaster
      agoraEngine.setClientRole(ClientRoleType.ClientRoleBroadcaster);

      // Start preview
      agoraEngine.startPreview();

      setEngine(agoraEngine);
      console.log("✅ Agora SDK initialized");

      // Join channel
      joinChannel(agoraEngine);
    } catch (error) {
      console.error("❌ Agora initialization error:", error);
      Alert.alert("Error", "Failed to initialize video streaming");
    }
  };

  const joinChannel = async (agoraEngine: IRtcEngine) => {
    try {
      console.log(`🔗 Joining channel: ${channelName}`);

      // Join channel
      agoraEngine.joinChannel("", channelName, 0, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
    } catch (error) {
      console.error("❌ Join channel error:", error);
      Alert.alert("Error", "Failed to join streaming channel");
    }
  };

  const cleanupAgora = async () => {
    try {
      if (engine) {
        engine.leaveChannel();
        engine.release();
        console.log("🧹 Agora cleaned up");
      }
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  };

  const toggleCamera = () => {
    if (!engine) return;
    try {
      engine.enableLocalVideo(!cameraEnabled);
      setCameraEnabled(!cameraEnabled);
    } catch (error) {
      console.error("Toggle camera error:", error);
    }
  };

  const toggleMic = () => {
    if (!engine) return;
    try {
      engine.enableLocalAudio(!micEnabled);
      setMicEnabled(!micEnabled);
    } catch (error) {
      console.error("Toggle mic error:", error);
    }
  };

  const handleLeave = () => {
    cleanupAgora();
    navigation.goBack();
  };

  if (!joined || !engine) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-white mt-4">Connecting to live stream...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="p-4 mt-12 absolute top-0 left-0 right-0 z-10">
        <View className="bg-black/60 px-4 py-2 rounded-2xl flex-row items-center gap-2 border border-white/10">
          <View className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <View>
            <Text className="text-white font-bold text-sm">Live Broadcast</Text>
            <Text className="text-white/60 text-[10px]">
              Channel: {channelName}
            </Text>
          </View>
        </View>
      </View>

      {/* Video View */}
      <View className="flex-1">
        {cameraEnabled ? (
          <RtcSurfaceView canvas={{ uid: 0 }} style={{ flex: 1 }} />
        ) : (
          <View className="flex-1 justify-center items-center bg-gray-900">
            <Icon name="video-off" size={64} color="white" />
            <Text className="text-white text-lg font-semibold mt-4">
              Camera is Off
            </Text>
          </View>
        )}

        {/* Overlay Info (Channel Name etc.) */}
        <View className="absolute inset-0 justify-center items-center pointer-events-none">
          {!cameraEnabled && (
            <View className="bg-black/40 p-4 rounded-xl">
              <Text className="text-white/60 text-sm">
                Broadcasting Audio Only
              </Text>
            </View>
          )}
          <View className="mt-4 bg-black/40 px-3 py-1 rounded-full">
            <Text className="text-white/40 text-[10px]">
              Channel: {channelName}
            </Text>
          </View>
        </View>
      </View>

      {/* Controls */}
      <View className="absolute bottom-0 left-0 right-0 p-6 pb-12">
        <View className="flex-row justify-center gap-6">
          {/* Mic Toggle */}
          <TouchableOpacity
            onPress={toggleMic}
            className={`w-16 h-16 rounded-full items-center justify-center ${
              micEnabled ? "bg-gray-800/80" : "bg-red-500"
            }`}
          >
            <Icon
              name={micEnabled ? "microphone" : "microphone-off"}
              size={28}
              color="white"
            />
          </TouchableOpacity>

          {/* Leave Button */}
          <TouchableOpacity
            onPress={handleLeave}
            className="w-16 h-16 rounded-full bg-red-500 items-center justify-center"
          >
            <Icon name="phone-hangup" size={28} color="white" />
          </TouchableOpacity>

          {/* Camera Toggle */}
          <TouchableOpacity
            onPress={toggleCamera}
            className={`w-16 h-16 rounded-full items-center justify-center ${
              cameraEnabled ? "bg-gray-800/80" : "bg-red-500"
            }`}
          >
            <Icon
              name={cameraEnabled ? "video" : "video-off"}
              size={28}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LiveStreamScreen;
