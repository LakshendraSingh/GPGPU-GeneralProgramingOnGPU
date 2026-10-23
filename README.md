# GPGPU: General Programming on GPU

A high-performance, in-browser Multi-Paradigm GPU Compute platform supporting 10 GPGPU programming paradigms executing directly on physical GPU silicon via WebGPU and WebAssembly.

---

## Overview

**GPGPU** enables developers, researchers, and students to write, compile, execute, and profile compute shaders and parallel kernels directly in the browser across modern graphics hardware. It bridges diverse GPU programming models into a unified workbench with real-time compilation, live hardware buffer readback, interactive compute visualization, and intermediate bytecode inspection.

---

## Supported Compute Paradigms & Toolchains

| # | Paradigm / Language | Standard / Target | Toolchains & Specifications | Execution Pipeline |
|---|-------------------|-------------------|----------------------------|--------------------|
| 1 | **AMD ROCm (HIP)** | HIP C++ Dialect | [ROCm/HIP](https://github.com/ROCm/HIP), [ROCm/clr](https://github.com/ROCm/clr) | ROCm Kernel Parser -> WGSL Compute -> WebGPU Pipeline |
| 2 | **WebGPU** | Native WGSL 1.0 | [gpuweb/gpuweb](https://github.com/gpuweb/gpuweb), [google/dawn](https://dawn.googlesource.com/dawn) | Direct WebGPU Driver API Pipeline Execution |
| 3 | **NVIDIA CUDA / HIP** | C++17 Runtime | [chipStar](https://github.com/CHIP-SPV/chipStar), [NVIDIA CUDA](https://developer.nvidia.com/cuda-zone) | LLVM WASIX Compiler + Clspv + Tint + WebGPU |
| 4 | **OpenCL C** | OpenCL 2.0 / 3.0 | [google/clspv](https://github.com/google/clspv), [KhronosGroup/OpenCL-Headers](https://github.com/KhronosGroup/OpenCL-Headers) | Clspv / OpenCL Transpiler -> WGSL -> WebGPU |
| 5 | **Vulkan Compute** | GLSL 450 / SPIR-V | [KhronosGroup/glslang](https://github.com/KhronosGroup/glslang), [KhronosGroup/SPIRV-Tools](https://github.com/KhronosGroup/SPIRV-Tools) | Khronos glslang (WASM) -> SPIR-V -> Tint (WASM) -> WebGPU |
| 6 | **OpenGL Compute** | GLSL 430 / SPIR-V | [KhronosGroup/glslang](https://github.com/KhronosGroup/glslang), [google/dawn/tint](https://dawn.googlesource.com/dawn/+/refs/heads/main/src/tint) | Khronos glslang (WASM) -> SPIR-V -> Tint (WASM) -> WebGPU |
| 7 | **Apple Metal (MSL)** | Metal Shading Language | [apple/metal-shader-converter](https://github.com/apple/metal-shader-converter), [KhronosGroup/SPIRV-Cross](https://github.com/KhronosGroup/SPIRV-Cross) | MSL Transpiler -> WGSL -> WebGPU |
| 8 | **SYCL 2020** | C++20 oneAPI | [AdaptiveCpp/AdaptiveCpp](https://github.com/AdaptiveCpp/AdaptiveCpp), [intel/llvm](https://github.com/intel/llvm) | SYCL Kernel Extractor -> WGSL -> WebGPU |
| 9 | **OpenMP & OpenACC** | OpenMP 5.2 / OpenACC 3.2 | [llvm/llvm-project](https://github.com/llvm/llvm-project) (OpenMP Target Offload `libomptarget`) | Pragma Offload Transpiler -> WGSL -> WebGPU |
| 10 | **OpenAI Triton** | Python GPU DSL | [triton-lang/triton](https://github.com/triton-lang/triton), [openai/triton](https://github.com/openai/triton) | Triton AST Parser -> WGSL -> WebGPU |

---

## Real-Time Hardware Execution Architecture

The compute pipeline executes on physical GPU silicon without requiring remote servers or cloud instances:

1. **Hardware Device Selection:**
   - The browser queries local graphics hardware via `navigator.gpu.requestAdapter()`.
   - On macOS, WebGPU connects directly to Apple's **Metal** driver (`Apple Metal-3` on Apple Silicon).
   - On Windows and Linux, WebGPU interfaces directly with **DirectX 12** or **Vulkan** drivers (NVIDIA, AMD, Intel).
2. **Real-Time WebAssembly Compilers:**
   - **GLSL to SPIR-V:** Official Khronos Group `glslang` compiler compiled to WebAssembly (`glslang.js`) translates GLSL 430/450 compute shaders to binary SPIR-V bytecode in memory.
   - **SPIR-V to WGSL:** Google Dawn Tint engine compiled to WebAssembly (`twgsl.js` / `twgsl.wasm`) translates binary SPIR-V bytecode directly into WebGPU WGSL.
   - **HIP C++ to SPIR-V:** Clang/LLVM 17 toolchain compiled to WebAssembly compiles AMD HIP C++ source code to SPIR-V.
   - **Kernel Transpilation:** Integrated abstract syntax tree parsers extract parameters, memory address spaces (`device`, `constant`, `__global`), thread indices (`thread_position_in_grid`, `hipThreadIdx_x`, `get_global_id`), and barrier intrinsics into strongly typed WGSL compute pipelines.
3. **Physical VRAM Buffer Allocation & Staging Readback:**
   - Allocates hardware video memory via `device.createBuffer({ usage: STORAGE | COPY_SRC | COPY_DST })`.
   - Dispatches hardware compute workgroups across GPU execution units via `passEncoder.dispatchWorkgroups(...)`.
   - Copies results back from VRAM to system memory via `stagingBuffer.mapAsync(GPUMapMode.READ)` and displays live computed outputs, verified arrays, or decoded character text.

---

## Features

- **Monaco Code Editor:** Full syntax highlighting, auto-indentation, and multi-cursor support for C++, GLSL, WGSL, MSL, and Python.
- **Unified Sample Library:** Pre-configured compute kernels for every paradigm, including cellular automata (Conway's Game of Life), vector addition, color inversion, and string generation.
- **Export Capabilities:**
  - **Save Code:** Export active editor source code with framework-specific extensions (`.hip`, `.cu`, `.wgsl`, `.cl`, `.comp`, `.metal`, `.cpp`, `.py`).
  - **Save WGSL:** Export real-time transpiled WebGPU Shading Language source files.
  - **Save SPV:** Export compiled binary Khronos SPIR-V bytecode (`.spv`).
- **Hardware Pipeline Visualizer & Cellular Automaton Display:** Real-time dual-mode canvas rendering live cellular simulations or visual memory flow diagnostics with microsecond GPU timing.
- **High-Contrast Monochrome Interface:** Minimalist design system with pure black backgrounds, silver borders, and high-contrast typography.
- **Live Compiler Diagnostics:** Captures WebGPU driver compilation information line-by-line via `shaderModule.getCompilationInfo()` and reports errors with exact line and column numbers.

---

## Quick Start

### Prerequisites

- A browser with WebGPU support enabled (Google Chrome, Microsoft Edge, or Chromium 113+).
- Either **Node.js** (v16+) or **Python 3**.

### Running the Application

#### Option A: Node.js (Zero external dependencies)
```bash
node serve.js
```

#### Option B: Python 3 (Zero external dependencies)
```bash
python3 serve.py
```

Then open your browser to:
```text
http://localhost:5173
```

---

## Why a Dedicated Server Script is Required

Modern web browsers enforce **Cross-Origin Isolation** headers to enable high-resolution timers, `SharedArrayBuffer`, and multithreaded WebAssembly workers:
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

Opening `index.html` directly via `file://` disables `SharedArrayBuffer`, preventing WebAssembly execution threads and WebGPU pthreads from initializing. Both `serve.js` and `serve.py` automatically supply these headers with zero external package dependencies.

---

## Project Structure

```text
.
|-- dist/
|   |-- index.html              # Main HTML entry point
|   |-- gpgpu.js                # Unified GPGPU compute engine (JS distribution)
|   |-- gpgpu.ts                # Unified GPGPU compute engine (TypeScript source)
|   |-- glslang.js              # Khronos glslang WebAssembly compiler
|   |-- twgsl.js                # Google Tint WebAssembly translator
|   |-- twgsl.wasm              # Google Tint WebAssembly binary
|   `-- _app/                   # UI assets and Monaco editor chunks
|-- emcc/                       # WebAssembly runtime and compiler workers
|-- hip/                        # HIP headers and devicelib definitions
|-- clspv/                      # OpenCL to SPIR-V compilation headers
|-- polyfill/                   # WASIX system polyfills
|-- serve.js                    # Zero-dependency Node.js server with COOP/COEP headers
|-- serve.py                    # Zero-dependency Python 3 server with COOP/COEP headers
|-- build.sh                    # Build script
`-- README.md                   # Documentation
```

---

## Repository

- **GitHub:** [https://github.com/LakshendraSingh/GPGPU-GeneralProgramingOnGPU](https://github.com/LakshendraSingh/GPGPU-GeneralProgramingOnGPU)

---

## License

This project is licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.
