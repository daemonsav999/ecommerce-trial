import { Request, Response } from 'express';
import { GroupBuy } from '../models/groupBuy';
import { eventService } from '../services/eventService';
import { pricingService } from '../services/pricingService';

class GroupBuyController {
  async create(req: Request, res: Response) {
    try {
      const groupBuy = new GroupBuy({
        ...req.body,
        creator: req.user._id,
        status: 'active',
        currentPrice: await pricingService.calculateInitialPrice(req.body)
      });

      await groupBuy.save();
      
      // Notify real-time systems
      await eventService.publishEvent({
        type: 'group_buy_created',
        payload: groupBuy,
        timestamp: Date.now()
      });

      res.status(201).json(groupBuy);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create group buy' });
    }
  }

  async join(req: Request, res: Response) {
    try {
      const { groupBuyId } = req.params;
      const userId = req.user._id;

      const groupBuy = await GroupBuy.findById(groupBuyId);
      if (!groupBuy) {
        return res.status(404).json({ error: 'Group buy not found' });
      }

      // Add participant
      groupBuy.participants.push({
        user: userId,
        joinedAt: new Date(),
        invitedBy: req.body.invitedBy
      });

      // Update price based on new participant count
      const newPrice = await pricingService.calculatePrice(groupBuy);
      groupBuy.currentPrice = newPrice;

      await groupBuy.save();

      // Notify real-time systems
      await eventService.publishEvent({
        type: 'group_buy_update',
        payload: {
          groupBuyId,
          participants: groupBuy.participants,
          currentPrice: newPrice
        },
        timestamp: Date.now()
      });

      res.json(groupBuy);
    } catch (error) {
      res.status(500).json({ error: 'Failed to join group buy' });
    }
  }
}

export const groupBuyController = new GroupBuyController();