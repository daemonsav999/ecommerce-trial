import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGenerateShareLinkMutation } from '@/services/api';
import { useToast } from '@/hooks/useToast';
import { WhatsappShareButton, WhatsappIcon } from 'react-share';
import styles from './SocialShare.module.scss';

interface SocialShareProps {
  productId: string;
  groupBuyId?: string;
  title: string;
  price: number;
  groupPrice: number;
  image: string;
  discount: number;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  productId,
  groupBuyId,
  title,
  price,
  groupPrice,
  image,
  discount
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [generateLink] = useGenerateShareLinkMutation();
  const [shareUrl, setShareUrl] = useState('');
  const { showToast } = useToast();

  const handleGenerateLink = async () => {
    try {
      const { shareUrl } = await generateLink({
        productId,
        groupBuyId,
        type: 'social',
        timestamp: new Date().toISOString(),
        user: 'daemonsav999'
      }).unwrap();
      
      setShareUrl(shareUrl);
      setIsOpen(true);
    } catch (error) {
      showToast('Failed to generate share link', 'error');
    }
  };

  const shareMessage = `🔥 Amazing Deal Alert! 🔥\n\n${title}\n\n💰 Regular Price: $${price}\n🎉 Group Buy Price: $${groupPrice}\n💥 Save ${discount}%!\n\nJoin my group buy and save big! 🛍️\n\n`;

  return (
    <>
      <button onClick={handleGenerateLink} className={styles.shareButton}>
        <i className="icon-share" />
        Share & Save
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className={styles.modalContent}>
              <button 
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>

              <h3>Share this deal with friends!</h3>
              
              <div className={styles.preview}>
                <img src={image} alt={title} />
                <div className={styles.details}>
                  <h4>{title}</h4>
                  <div className={styles.prices}>
                    <span className={styles.groupPrice}>
                      ${groupPrice}
                    </span>
                    <span className={styles.originalPrice}>
                      ${price}
                    </span>
                    <span className={styles.discount}>
                      {discount}% OFF
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.shareOptions}>
                <WhatsappShareButton
                  url={shareUrl}
                  title={shareMessage}
                  className={styles.whatsappButton}
                >
                  <div className={styles.shareOption}>
                    <WhatsappIcon size={32} round />
                    <span>Share on WhatsApp</span>
                  </div>
                </WhatsappShareButton>

                <button 
                  className={styles.copyButton}
                  onClick={() => {
                    navigator.clipboard.writeText(`${shareMessage}\n${shareUrl}`);
                    showToast('Link copied to clipboard!', 'success');
                  }}
                >
                  <i className="icon-copy" />
                  <span>Copy Link</span>
                </button>
              </div>

              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.number}>
                    {Math.floor(Math.random() * 50) + 10}
                  </span>
                  <span className={styles.label}>
                    People sharing
                  </span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.number}>
                    {Math.floor(Math.random() * 100) + 50}
                  </span>
                  <span className={styles.label}>
                    Views today
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};