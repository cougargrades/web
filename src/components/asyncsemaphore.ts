
/**
 * Author: Alexandru Nedelcu (@alexandru)
 * From: https://alexn.org/blog/2020/04/21/javascript-semaphore.html#isso-thread
 * From (archived): https://web.archive.org/web/20201127022014/https://alexn.org/blog/2020/04/21/javascript-semaphore.html
 */
export class AsyncSemaphore {
  private _available: number
  private _upcoming: (() => void)[]
  private _heads: (() => void)[]

  private _completeFn!: () => void
  private _completePr!: Promise<void>

  constructor(public readonly workersCount: number) {
    if (workersCount <= 0) throw new Error("workersCount must be positive")
    this._available = workersCount
    this._upcoming = []
    this._heads = []
    this._refreshComplete()
  }

  async withLock<A>(f: () => Promise<A>): Promise<A> {
    await this._acquire()
    return this._execWithRelease(f)
  }

  async withLockRunAndForget<A>(f: () => Promise<A>): Promise<void> {
    await this._acquire()
    // Ignoring returned promise on purpose!
    this._execWithRelease(f)
  }

  async awaitTerminate(): Promise<void> {
    if (this._available < this.workersCount) {
      return this._completePr
    }
  }

  private async _execWithRelease<A>(f: () => Promise<A>): Promise<A> {
    try {
      return await f()
    } finally {
      this._release()
    }
  }

  private _queue(): (() => void)[] {
    if (!this._heads.length) {
      this._heads = this._upcoming.reverse()
      this._upcoming = []
    }
    return this._heads
  }

  private _acquire(): void | Promise<void> {
    if (this._available > 0) {
      this._available -= 1
      return undefined
    } else {
      let fn: () => void = () => {/***/}
      const p = new Promise<void>(ref => { fn = ref })
      this._upcoming.push(fn)
      return p
    }
  }

  private _release(): void {
    const queue = this._queue()
    if (queue.length) {
      const fn = queue.pop()
      if (fn) fn()
    } else {
      this._available += 1

      if (this._available >= this.workersCount) {
        const fn = this._completeFn
        this._refreshComplete()
        fn()
      }
    }
  }

  private _refreshComplete(): void {
    let fn: () => void = () => {/***/}
    this._completePr = new Promise<void>(r => { fn = r })
    this._completeFn = fn
  }
}
