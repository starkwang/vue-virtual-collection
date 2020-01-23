export function createFakeResizeObserverController() {
  class FakeResizeObserver {
    constructor(callback) {
      this.callback = callback
      this.targets = []
    }

    observe(target) {
      this.targets = [...this.targets, target]
    }

    unobserve(target) {
      this.targets = this.targets.filter(t => t !== target)
    }

    disconnect() {
      this.targets = []
    }

    fakeResize(contentRect) {
      this.targets.forEach(t => {
        this.callback(
          [
            {
              target: t,
              contentRect
            }
          ],
          this
        )
      })
    }
  }

  return FakeResizeObserver
}
