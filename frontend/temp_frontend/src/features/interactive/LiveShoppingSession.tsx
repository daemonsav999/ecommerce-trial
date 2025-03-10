import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebRTCService } from './services/WebRTCService';
import { ProductShowcase } from './components/ProductShowcase';
import { LiveChat } from './components/LiveChat';
import { ViewersList } from './components/ViewersList';
import { InteractionPanel } from './components/InteractionPanel';
import { useWebRTC } from '../../hooks/useWebRTC';

interface LiveShoppingSessionProps {
  sessionId: string;
  productId: string;
  isHost: boolean;
}

export const LiveShoppingSession = ({
  sessionId,
  productId,
  isHost
}: LiveShoppingSessionProps) => {
  const {
    localStream,
    remoteStream,
    startBroadcast,
    joinBroadcast,
    endSession,
    connectionStatus,
    viewerCount,
    error
  } = useWebRTC(sessionId);

  const [activeProduct, setActiveProduct] = useState(null);
  const [reactions, setReactions] = useState<string[]>([]);

  useEffect(() => {
    if (isHost) {
      startBroadcast();
    } else {
      joinBroadcast();
    }

    return () => {
      endSession();
    };
  }, [sessionId]);

  const handleProductSelect = (product) => {
    setActiveProduct(product);
    // Notify viewers about product change
  };

  const handleReaction = (type: string) => {
    setReactions(prev => [...prev, type]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r !== type));
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.videoContainer}>
          {isHost ? (
            <BroadcasterView stream={localStream} />
          ) : (
            <ViewerStream stream={remoteStream} />
          )}
          <ViewersList count={viewerCount} />
          <ReactionOverlay reactions={reactions} />
        </View>

        <ProductShowcase
          productId={productId}
          isHost={isHost}
          onProductSelect={handleProductSelect}
          activeProduct={activeProduct}
        />
      </View>

      <View style={styles.sidebar}>
        <LiveChat
          sessionId={sessionId}
          onReaction={handleReaction}
        />
        
        <InteractionPanel
          isHost={isHost}
          activeProduct={activeProduct}
          onPoll={handleCreatePoll}
          onFlashSale={handleFlashSale}
          onQuestion={handleQuestion}
        />
      </View>

      {error && (
        <ErrorOverlay
          message={error}
          onRetry={isHost ? startBroadcast : joinBroadcast}
        />
      )}

      <ConnectionStatus status={connectionStatus} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 3,
  },
  sidebar: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },
  videoContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    position: 'relative',
  },
});