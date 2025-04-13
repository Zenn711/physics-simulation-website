
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SimulationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  tag: string;
  color: string;
  features: string[];
}

const SimulationCard = ({ 
  title, 
  description, 
  icon, 
  link, 
  tag, 
  color, 
  features 
}: SimulationCardProps) => (
  <Link to={link}>
    <motion.div 
      className="block h-full"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <Card className="h-full dark:bg-gray-800/60 dark:border-gray-700/50 overflow-hidden shadow-lg hover:shadow-xl transition-shadow relative z-10">
        <div className={`bg-gradient-to-br ${color} dark:opacity-90 h-2`} />
        <div className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 text-xs font-bold px-2 py-1 rounded-full">
          {tag}
        </div>
        <CardContent className="p-6">
          <div className="mb-4 text-primary dark:text-indigo-400">
            {icon}
          </div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{description}</p>
          
          {features && features.length > 0 && (
            <ul className="space-y-1 mb-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          )}
          
          <motion.div 
            className="mt-auto flex items-center text-primary dark:text-indigo-400 text-sm font-medium"
            whileHover={{ x: 5 }}
          >
            Explore <ArrowRight className="ml-1 h-4 w-4" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  </Link>
);

export default SimulationCard;
