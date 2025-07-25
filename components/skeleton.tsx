import Skeleton from '@mui/material/Skeleton'
import styles from './skeleton.module.scss'
import type { Property } from 'csstype'

interface SkeletonProps {
  width: string | number;
  height: string | number;
  margin?: number;
  display?: Property.Display;
}

const DEFAULT_MARGIN = 4

export const CustomSkeleton = ({ width, height, margin, display }: SkeletonProps) => (
  <Skeleton
    variant="rectangular"
    className={styles.rounded}
    style={{ margin: `${margin === undefined ? DEFAULT_MARGIN : margin}px`, display }}
    width={typeof width === 'number' ? width - (margin === undefined ? DEFAULT_MARGIN : margin) * 2 : width}
    height={typeof height === 'number' ? height - (margin === undefined ? DEFAULT_MARGIN : margin) * 2 : height}
  />
);
