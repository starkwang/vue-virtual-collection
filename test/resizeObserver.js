export function createFakeResizeObserver() {
  class FakeResizeObserver {
    constructor() {
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
  }

  return FakeResizeObserver
}
