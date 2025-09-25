"use client";

import Lottie from "lottie-react";

interface PropTypes {
  animateData: any;
  className: string;
}

function Animate({ animateData, className }: PropTypes) {
  return <Lottie animationData={animateData} className={className} loop={true} />;
}

export default Animate;
