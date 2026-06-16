import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Ticket, Clock, ArrowRight, Check } from 'lucide-react';
import { Promotion } from '../types';

interface PromoBannersProps {
  promotions: Promotion[];
  onPromoClick: (promoCode: string) => void;
  onBrowseMenu: (category?: string) => void;
}


