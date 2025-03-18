'use client';

import type { JSX } from 'react';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import type { DotLottieReactProps } from '@lottiefiles/dotlottie-react';

const LottiePlayer = (props: DotLottieReactProps): JSX.Element => {
  return <DotLottieReact {...props} />;
};

export default LottiePlayer;
