declare module 'binpacking' {
    interface Block {
        w: number
        h: number
        x?: number
        y?: number
    }

    class GrowingPacker {
        root: Block
        fit(blocks: Block[]): void
    }

    class Packer {
        constructor(w: number, h: number)
        fit(blocks: Block[]): void
    }
}