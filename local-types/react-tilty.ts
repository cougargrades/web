
/**
 * TODO: Remove when this pull request is accepted:
 * https://github.com/jonahallibone/react-tilty/pull/14
 */
declare module 'react-tilty' {

  import type { ReactNode, CSSProperties } from 'react'
  import type { Property } from 'csstype'

  export interface TiltyProps {
    style?: CSSProperties;
    className?: string | Property.AnimationTimingFunction
    reverse?: boolean;
    max?: number;
    perspective?: number;
    easing?: Property.AnimationTimingFunction;
    scale?: number;
    speed?: number;
    axis?: 'X' | 'Y' | null;
    reset?: boolean;
    glare?: boolean;
    maxGlare?: number;
    glareStyle?: CSSProperties;
    gyroscope?: boolean;
    gyroscopeMinAngleX?: number;
    gyroscopeMaxAngleX?: number;
    gyroscopeMinAngleY?: number;
    gyroscopeMaxAngleY?: number;
    onMouseEnter?: () => {};
    onMouseMove?: () => {};
    onMouseLeave?: () => {};
    onTiltChange?: () => {};
    children: ReactNode;
  }

  export default function Tilty(props: TiltyProps): JSX.Element;
}

