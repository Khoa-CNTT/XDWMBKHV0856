import { useState } from "react";
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function CoursePreview() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        <div className="relative aspect-video w-full">
          {!isPlaying ? (
            <>
              <img
                src="/placeholder.svg"
                alt="Course preview"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(true)}
                  className="bg-white/90 rounded-full p-4 shadow-lg"
                >
                  <FaPlay className="h-8 w-8 text-primary fill-current" />
                </motion.button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-2 rounded text-center">
                Watch course preview video (5:20)
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-black flex items-center justify-center">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Course Preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">$59.99</span>
              <span className="text-lg line-through text-muted-foreground">
                $119.99
              </span>
            </div>
            <span className="text-red-500">🔥 50% off - 2 days left</span>
          </div>
          <Button className="w-full text-lg py-6" size="lg">
            Buy Now
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            30-day money-back guarantee
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
