import { useEffect, useState } from "react";

const images = [
  require("../assets/carousel-bg/cartoon-carousel-bgimg (1).png"),
  require("../assets/carousel-bg/cartoon-carousel-bgimg (2).png"),
  require("../assets/carousel-bg/cartoon-carousel-bgimg (3).png"),
];

function BackgroundCarousel() {
  const [frontIndex, setFrontIndex] = useState(0);
  const [backIndex, setBackIndex] = useState(1);
  const [showFront, setShowFront] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFront(false);
      setTimeout(() => {
        setFrontIndex(backIndex);
        setBackIndex((backIndex + 1) % images.length);
        setShowFront(true);
      }, 500);
    }, 4500);

    return () => clearInterval(interval);
  }, [backIndex]);

  return (
    <div className="fixed inset-0 z-[-1]">
      <img
        src={images[frontIndex]}
        alt="background"
        className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-50000 ${
          showFront ? "opacity-100" : "opacity-0"
        }`}
      />
      <img
        src={images[backIndex]}
        alt="background"
        className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-50000 ${
          showFront ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}

export default BackgroundCarousel;