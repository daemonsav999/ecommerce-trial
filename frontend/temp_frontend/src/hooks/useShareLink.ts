import { useState } from 'react';
import { useGenerateShareLinkMutation } from '@/services/api';
import { useToast } from './useToast';

interface UseShareLinkProps {
  productId: string;
  groupBuyId?: string;
  title: string;
  price: number;
  groupPrice: number;
}

export const useShareLink = ({
  productId,
  groupBuyId,
  title,
  price,
  groupPrice
}: UseShareLinkProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateLink] = useGenerateShareLinkMutation();
  const { showToast } = useToast();

  const shareOnWhatsApp = async () => {
    try {
      setIsGenerating(true);
      const { shareUrl } = await generateLink({
        productId,
        groupBuyId,
        type: 'whatsapp',
        timestamp: new Date().toISOString(),
        user: 'daemonsav999'
      }).unwrap();

      const discount = Math.round((1 - groupPrice / price) * 100);
      const message = `🔥 Amazing Deal Alert! 🔥\n\n${title}\n\n💰 Regular Price: $${price}\n🎉 Group Buy Price: $${groupPrice}\n💥 Save ${discount}%!\n\nJoin my group buy and save big! 🛍️\n\n${shareUrl}`;

      // Open WhatsApp with pre-filled message
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
    } catch (error) {
      showToast('Failed to generate share link', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    shareOnWhatsApp,
    isGenerating
  };
};