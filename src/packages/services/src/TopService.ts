
import { z } from 'zod'
import { BinnedSparklineData } from '@cougargrades/models';
import { RankingResult, TopOptions, TopResult } from '@cougargrades/models/dto'
import { BaseApiService } from './private/BaseApiService'


export class TopService extends BaseApiService {
  constructor() {
    super()
  }

  public async GetTopResults({ metric, topic, limit, time, hideCore }: TopOptions): Promise<TopResult[]> {
    return await this.Get(`/api/top`, { metric, topic, limit: limit.toString(), time, hideCore: `${hideCore}` }, TopResult.array()) ?? [];
  }

  public async GetCourseRank(courseName: string, { metric, time }: Pick<TopOptions, 'metric' | 'time'>): Promise<RankingResult | null> {
    return await this.Get(`/api/top/rank/course/${encodeURIComponent(courseName)}`, { metric, time }, RankingResult);
  }

  public async GetInstructorRank(instructorName: string, { metric, time }: Pick<TopOptions, 'metric' | 'time'>): Promise<RankingResult | null> {
    return await this.Get(`/api/top/rank/instructor/${encodeURIComponent(instructorName)}`, { metric, time }, RankingResult);
  }

  // public async GetCourseSparkline(courseName: string, { metric, time }: Pick<TopOptions, 'metric' | 'time'>): Promise<BinnedSparklineData | null> {
  //   return await this.Get(`/api/top/sparkline/course/${encodeURIComponent(courseName)}`, { metric, time }, BinnedSparklineData);
  // }

  // public async GetInstructorSparkline(instructorName: string, { metric, time }: Pick<TopOptions, 'metric' | 'time'>): Promise<BinnedSparklineData | null> {
  //   return await this.Get(`/api/top/sparkline/instructor/${encodeURIComponent(instructorName)}`, { metric, time }, BinnedSparklineData);
  // }

  public async GetTopicSparkline(courseName: string, { metric, time, topic }: Pick<TopOptions, 'metric' | 'time' | 'topic'>): Promise<BinnedSparklineData | null> {
    return await this.Get(`/api/top/sparkline/${topic}/${encodeURIComponent(courseName)}`, { metric, time }, BinnedSparklineData);
  }
}

