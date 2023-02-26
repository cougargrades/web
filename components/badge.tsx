import React, { CSSProperties } from 'react'
import Skeleton from '@mui/material/Skeleton'
import type { Property } from 'csstype'
import styles from './badge.module.scss'

type BadgeProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> & {
  extraClassNames?: string;
  title?: string;
  suffix?: React.ReactNode;
  style?: CSSProperties;
  children: React.ReactNode;
}

type SkeletonProps = {
  style?: CSSProperties
}

export function Badge(props: BadgeProps) {
  return (
    <span
      {...props}
      className={`${styles.badge} ${props.className}`}
      style={props.style}
      title={props.title}
    >
      <span className={styles.badgeText}>
      {props.children}
      </span>
      <span>{props.suffix}</span>
    </span>
  );
}

export function BadgeSkeleton({ style }: SkeletonProps) {
  return (
    <Skeleton variant="rectangular" className={styles.skeleton} width={80} height={20} style={style} />
  )
}


export enum LetterGrade { A, B, C, D, F, I, W, S, U, NCR }
export type Grade = keyof typeof LetterGrade;

export const grade2Color: Record<Grade, Property.Color> = {
  'A': '#87cefa',
  'B': '#90ee90',
  'C': '#ffff00',
  'D': '#ffa07a',
  'F': '#cd5c5c',
  'I': '#d3d3d3',
  'W': '#9370D8',
  'S': '#8fbc8f',
  'U': '#d87093',
  'NCR': '#d87093'
}

export const SEARCH_RESULT_COLOR: Property.Color = '#f0f8ff'//'#b0c4de' //'#f0f8ff'; // aliceblue

// Based on https://github.com/cougargrades/web/blob/3d511fc56b0a90f2038883a71852245b726af7e3/src/components/instructors/GPABadge.js
export function getGradeForGPA(n: number | undefined): Grade {
  // 4.0 is rarely scored in practice
  if (n === undefined) return 'I'
  if (n === 0.0) return 'I'
  if (n > 3.5) return 'A'
  if (n > 2.5) return 'B'
  if (n > 1.5) return 'C'
  // 1.0 is rarely scored in practice
  if (n < 1.5) return 'D'
  if (n < 0.5) return 'F'
  return 'I'
}

export function getGradeForStdDev(sd: number | undefined): Grade {
  /**
   * For the standardDeviation values of all instructors (latest data: Summer 2019)
   * ===================================================
   * min: 0.0007071067811864697
   * mean: 0.28632900784232573
   * median: 0.24911322128640845
   * max: 1.6836212460051696
   * 
   * Interpretations:
   * ===============
   * - 25% likely to have stddev under 0.149
   * - 50% likely to have stddev under 0.286
   * - 75% likely to have stddev under 0.425
   * 
   * Color ranges:
   * ============
   * sigma < 0.149 
   */
  if (sd === undefined) return 'I'
  if (sd === 0.0) return 'I'
  if (sd < 0.149) return 'A'
  if (sd < 0.286) return 'B'
  if (sd < 0.425) return 'C'
  if (sd > 0.425) return 'D'
  return 'I'
}
