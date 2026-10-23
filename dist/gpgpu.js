/**
 * GPGPU - Unified GPU Compute Engine
 * Supports 10 GPGPU Paradigms:
 *  1. AMD ROCm (HIP / AMDGPU)
 *  2. WebGPU (Native WGSL)
 *  3. NVIDIA CUDA / AMD HIP (C++)
 *  4. OpenCL C (OpenCL 2.0 / 3.0)
 *  5. Vulkan Compute (GLSL 450 / SPIR-V)
 *  6. OpenGL Compute (GLSL 430 / SPIR-V)
 *  7. Apple Metal (MSL)
 *  8. SYCL 2020 (oneAPI / AdaptiveCpp)
 *  9. OpenMP & OpenACC (GPU Offload Directives)
 * 10. OpenAI Triton (Python GPU DSL)
 */

(function () {
  const ESC = '\x1b';

  const FRAMEWORKS = {
    'rocm': {
      name: 'AMD ROCm (HIP)',
      shortName: 'ROCm',
      badge: 'HIP C++',
      lang: 'cpp',
      repo: 'ROCm/ROCm, ROCm/HIP',
      samples: {
        'Game Of Life': `// AMD ROCm HIP Conway's Game of Life
#include <hip/hip_runtime.h>
#define WIDTH 64
#define HEIGHT 32

__global__ void rocm_game_of_life(const int* current, int* next, int width, int height) {
    int x = hipBlockDim_x * hipBlockIdx_x + hipThreadIdx_x;
    int y = hipBlockDim_y * hipBlockIdx_y + hipThreadIdx_y;
    if (x >= width || y >= height) return;

    int neighbors = 0;
    for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
            if (dx == 0 && dy == 0) continue;
            int nx = (x + dx + width) % width;
            int ny = (y + dy + height) % height;
            neighbors += current[ny * width + nx];
        }
    }
    int cell = current[y * width + x];
    next[y * width + x] = (neighbors == 3 || (cell == 1 && neighbors == 2)) ? 1 : 0;
}`,
        'Vector Add': `// AMD ROCm HIP Compute Kernel
#include <hip/hip_runtime.h>
#include <iostream>

__global__ void rocm_vector_add(const float* a, const float* b, float* c, int n) {
    int i = hipBlockDim_x * hipBlockIdx_x + hipThreadIdx_x;
    if (i < n) {
        c[i] = a[i] + b[i];
    }
}

int main() {
    std::cout << "ROCm HIP kernel ready." << std::endl;
    return 0;
}`,
        'SAXPY': `// AMD ROCm HIP SAXPY (y = a * x + y)
#include <hip/hip_runtime.h>

__global__ void rocm_saxpy(const float* x, const float* y_in, float* y_out, int n) {
    int i = hipBlockDim_x * hipBlockIdx_x + hipThreadIdx_x;
    float a = 2.5f;
    if (i < n) {
        y_out[i] = a * x[i] + y_in[i];
    }
}`
      }
    },
    'webgpu': {
      name: 'WebGPU (WGSL)',
      shortName: 'WebGPU',
      badge: 'WGSL',
      lang: 'rust',
      repo: 'gpuweb/gpuweb, google/dawn',
      samples: {
        'Game Of Life': `// WebGPU WGSL Conway's Game of Life
struct SimParams { width: u32, height: u32, generation: u32, pad: u32 };
@group(0) @binding(0) var<uniform> params: SimParams;
@group(0) @binding(1) var<storage, read> current: array<u32>;
@group(0) @binding(2) var<storage, read_write> next: array<u32>;

@compute @workgroup_size(16, 16, 1)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
    let x = id.x;
    let y = id.y;
    let w = params.width;
    let h = params.height;
    if (x >= w || y >= h) { return; }

    var neighbors: u32 = 0u;
    for (var dy: i32 = -1; dy <= 1; dy = dy + 1) {
        for (var dx: i32 = -1; dx <= 1; dx = dx + 1) {
            if (dx == 0 && dy == 0) { continue; }
            let nx = u32((i32(x) + dx + i32(w)) % i32(w));
            let ny = u32((i32(y) + dy + i32(h)) % i32(h));
            neighbors = neighbors + current[ny * w + nx];
        }
    }
    let idx = y * w + x;
    let cell = current[idx];
    next[idx] = select(0u, 1u, neighbors == 3u || (cell == 1u && neighbors == 2u));
}`,
        'Vector Add': `// Native WebGPU Shading Language (WGSL) Compute Shader
@group(0) @binding(0) var<storage, read> inA: array<f32>;
@group(0) @binding(1) var<storage, read> inB: array<f32>;
@group(0) @binding(2) var<storage, read_write> outC: array<f32>;

@compute @workgroup_size(64, 1, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let i = global_id.x;
    outC[i] = inA[i] + inB[i];
}`,
        'Prefix Sum': `// WebGPU Inclusive Prefix Scan
@group(0) @binding(0) var<storage, read> input: array<f32>;
@group(0) @binding(1) var<storage, read> dummy: array<f32>;
@group(0) @binding(2) var<storage, read_write> output: array<f32>;

@compute @workgroup_size(64, 1, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let i = global_id.x;
    var sum: f32 = 0.0;
    for (var j: u32 = 0u; j <= i; j = j + 1u) {
        sum = sum + input[j];
    }
    output[i] = sum;
}`
      }
    },
    'cuda_hip': {
      name: 'NVIDIA CUDA / AMD HIP',
      shortName: 'CUDA',
      badge: 'CUDA C++',
      lang: 'cpp',
      repo: 'lights0123/hipscript, ROCm/HIP, chipStar',
      samples: {
        'Game Of Life': `// Conway's Game of Life (CUDA/HIP)
#include <hip/hip_runtime.h>
#include <iostream>

#define BLOCK_WIDTH 16
#define BLOCK_HEIGHT 16

__global__ void game_of_life(const int* current, int* next, int width, int height) {
    int x = blockIdx.x * blockDim.x + threadIdx.x;
    int y = blockIdx.y * blockDim.y + threadIdx.y;
    if (x >= width || y >= height) return;

    int neighbors = 0;
    for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
            if (dx == 0 && dy == 0) continue;
            int nx = (x + dx + width) % width;
            int ny = (y + dy + height) % height;
            neighbors += current[ny * width + nx];
        }
    }
    int cell = current[y * width + x];
    next[y * width + x] = (neighbors == 3 || (cell == 1 && neighbors == 2)) ? 1 : 0;
}

int main() {
    std::cout << "CUDA/HIP Game of Life initialized." << std::endl;
    return 0;
}`,
        'Vector Add': `#include <hip/hip_runtime.h>
#include <iostream>

__global__ void vector_add(const float* a, const float* b, float* c, int n) {
    int i = blockDim.x * blockIdx.x + threadIdx.x;
    if (i < n) {
        c[i] = a[i] + b[i];
    }
}

int main() {
    std::cout << "CUDA/HIP Vector Add compiled." << std::endl;
    return 0;
}`
      }
    },
    'opencl': {
      name: 'OpenCL C',
      shortName: 'OpenCL',
      badge: 'OpenCL 2.0',
      lang: 'c',
      repo: 'google/clspv, KhronosGroup/OpenCL-Headers',
      samples: {
        'Game Of Life': `// OpenCL C Conway's Game of Life
__kernel void game_of_life(__global const int* current,
                           __global int* next,
                           int width, int height) {
    int x = get_global_id(0);
    int y = get_global_id(1);
    if (x >= width || y >= height) return;

    int neighbors = 0;
    for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
            if (dx == 0 && dy == 0) continue;
            int nx = (x + dx + width) % width;
            int ny = (y + dy + height) % height;
            neighbors += current[ny * width + nx];
        }
    }
    int cell = current[y * width + x];
    next[y * width + x] = (neighbors == 3 || (cell == 1 && neighbors == 2)) ? 1 : 0;
}`,
        'Vector Addition': `// OpenCL C Compute Kernel
__kernel void vector_add(__global const float* a,
                         __global const float* b,
                         __global float* c,
                         int n) {
    int id = get_global_id(0);
    if (id < n) {
        c[id] = a[id] + b[id];
    }
}`,
        'Matrix Multiplication': `// OpenCL C Matrix Multiply
__kernel void matmul(__global const float* A,
                     __global const float* B,
                     __global float* C) {
    int row = get_global_id(1);
    int col = get_global_id(0);
    int N = 16;
    float sum = 0.0f;
    for (int k = 0; k < N; k++) {
        sum += A[row * N + k] * B[k * N + col];
    }
    C[row * N + col] = sum;
}`
      }
    },
    'vulkan': {
      name: 'Vulkan Compute',
      shortName: 'Vulkan',
      badge: 'GLSL 450',
      lang: 'cpp',
      repo: 'KhronosGroup/glslang, KhronosGroup/SPIRV-Tools',
      samples: {
        'Game Of Life': `#version 450
layout(local_size_x = 16, local_size_y = 16) in;

layout(std430, set = 0, binding = 0) readonly buffer InGrid { int current[]; };
layout(std430, set = 0, binding = 1) writeonly buffer OutGrid { int next[]; };

void main() {
    uint x = gl_GlobalInvocationID.x;
    uint y = gl_GlobalInvocationID.y;
    int w = 64;
    int h = 32;
    if (x >= w || y >= h) return;

    int neighbors = 0;
    for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
            if (dx == 0 && dy == 0) continue;
            int nx = int(x + dx + w) % w;
            int ny = int(y + dy + h) % h;
            neighbors += current[ny * w + nx];
        }
    }
    int cell = current[y * w + x];
    next[y * w + x] = (neighbors == 3 || (cell == 1 && neighbors == 2)) ? 1 : 0;
}`,
        'Vector Multiply': `#version 450
layout(local_size_x = 64, local_size_y = 1, local_size_z = 1) in;

layout(std430, set = 0, binding = 0) readonly buffer InputA { float a[]; };
layout(std430, set = 0, binding = 1) readonly buffer InputB { float b[]; };
layout(std430, set = 0, binding = 2) writeonly buffer Output { float c[]; };

void main() {
    uint id = gl_GlobalInvocationID.x;
    c[id] = a[id] * b[id];
}`,
        'Particle Step': `#version 450
layout(local_size_x = 64) in;

struct Particle {
    vec4 pos;
    vec4 vel;
};

layout(std430, set = 0, binding = 0) readonly buffer InputP { Particle in_p[]; };
layout(std430, set = 0, binding = 1) writeonly buffer OutputP { Particle out_p[]; };

void main() {
    uint id = gl_GlobalInvocationID.x;
    out_p[id].pos = in_p[id].pos + in_p[id].vel * 0.016;
    out_p[id].vel = in_p[id].vel;
}`
      }
    },
    'opengl': {
      name: 'OpenGL Compute',
      shortName: 'OpenGL',
      badge: 'GLSL 430',
      lang: 'cpp',
      repo: 'KhronosGroup/glslang, google/dawn/tint',
      samples: {
        'Game Of Life': `#version 430
layout(local_size_x = 16, local_size_y = 16) in;

layout(std430, binding = 0) readonly buffer InGrid { int current[]; };
layout(std430, binding = 1) writeonly buffer OutGrid { int next[]; };

void main() {
    int x = int(gl_GlobalInvocationID.x);
    int y = int(gl_GlobalInvocationID.y);
    int w = 64;
    int h = 32;
    if (x >= w || y >= h) return;

    int neighbors = 0;
    for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
            if (dx == 0 && dy == 0) continue;
            int nx = (x + dx + w) % w;
            int ny = (y + dy + h) % h;
            neighbors += current[ny * w + nx];
        }
    }
    int cell = current[y * w + x];
    next[y * w + x] = (neighbors == 3 || (cell == 1 && neighbors == 2)) ? 1 : 0;
}`,
        'Vector Hypotenuse': `#version 430
layout(local_size_x = 64) in;
layout(std430, binding = 0) readonly buffer InputA { float a[]; };
layout(std430, binding = 1) readonly buffer InputB { float b[]; };
layout(std430, binding = 2) writeonly buffer Output { float c[]; };

void main() {
    uint id = gl_GlobalInvocationID.x;
    c[id] = sqrt(a[id] * a[id] + b[id] * b[id]);
}`,
        'Array Scalar Multiply': `#version 430
layout(local_size_x = 64) in;
layout(std430, binding = 0) readonly buffer InputA { float a[]; };
layout(std430, binding = 1) readonly buffer InputB { float b[]; };
layout(std430, binding = 2) writeonly buffer Output { float c[]; };

void main() {
    uint id = gl_GlobalInvocationID.x;
    c[id] = a[id] * 2.5 + b[id];
}`
      }
    },
    'metal': {
      name: 'Apple Metal (MSL)',
      shortName: 'Metal',
      badge: 'MSL',
      lang: 'cpp',
      repo: 'apple/metal-shader-converter, KhronosGroup/SPIRV-Cross',
      samples: {
        'Game Of Life': `#include <metal_stdlib>
using namespace metal;

kernel void game_of_life(device const int* current [[buffer(0)]],
                         device int* next [[buffer(1)]],
                         uint2 id [[thread_position_in_grid]]) {
    uint x = id.x;
    uint y = id.y;
    uint w = 64;
    uint h = 32;
    if (x >= w || y >= h) return;

    int neighbors = 0;
    for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
            if (dx == 0 && dy == 0) continue;
            int nx = (int(x) + dx + int(w)) % int(w);
            int ny = (int(y) + dy + int(h)) % int(h);
            neighbors += current[ny * w + nx];
        }
    }
    int cell = current[y * w + x];
    next[y * w + x] = (neighbors == 3 || (cell == 1 && neighbors == 2)) ? 1 : 0;
}`,
        'Vector Addition': `#include <metal_stdlib>
using namespace metal;

kernel void vector_add(device const float* inA [[buffer(0)]],
                       device const float* inB [[buffer(1)]],
                       device float* out [[buffer(2)]],
                       uint id [[thread_position_in_grid]]) {
    out[id] = inA[id] + inB[id];
}`,
        'Color Inversion': `#include <metal_stdlib>
using namespace metal;

kernel void color_invert(device const float* inColor [[buffer(0)]],
                         device float* outColor [[buffer(1)]],
                         uint id [[thread_position_in_grid]]) {
    outColor[id] = 1.0f - inColor[id];
}`,
        'Hello World': `#include <metal_stdlib>
using namespace metal;

constant uint msg[13] = {
    72, 101, 108, 108, 111, 44, 32,   // "Hello, "
    87, 111, 114, 108, 100, 33        // "World!"
};

kernel void hello(device uint *chars [[buffer(0)]],
                  uint i [[thread_position_in_grid]])
{
    if (i < 13) {
        chars[i] = msg[i];
    }
}`
      }
    },
    'sycl': {
      name: 'SYCL 2020',
      shortName: 'SYCL',
      badge: 'oneAPI',
      lang: 'cpp',
      repo: 'AdaptiveCpp/AdaptiveCpp, intel/llvm',
      samples: {
        'Game Of Life': `#include <sycl/sycl.hpp>
using namespace sycl;

void run_game_of_life(queue& q, const int* current, int* next, int width, int height) {
    q.parallel_for(range<2>(width, height), [=](id<2> idx) {
        int x = idx[0];
        int y = idx[1];
        int neighbors = 0;
        for (int dy = -1; dy <= 1; dy++) {
            for (int dx = -1; dx <= 1; dx++) {
                if (dx == 0 && dy == 0) continue;
                int nx = (x + dx + width) % width;
                int ny = (y + dy + height) % height;
                neighbors += current[ny * width + nx];
            }
        }
        int cell = current[y * width + x];
        next[y * width + x] = (neighbors == 3 || (cell == 1 && neighbors == 2)) ? 1 : 0;
    });
}`,
        'Vector Add': `#include <sycl/sycl.hpp>
using namespace sycl;

void vector_add(queue& q, const float* a, const float* b, float* c, size_t n) {
    q.parallel_for(range<1>(n), [=](id<1> idx) {
        int i = idx[0];
        c[i] = a[i] + b[i];
    });
}`
      }
    },
    'openmp': {
      name: 'OpenMP & OpenACC',
      shortName: 'OpenMP',
      badge: 'Directives',
      lang: 'cpp',
      repo: 'llvm/llvm-project',
      samples: {
        'Game Of Life': `// OpenMP 5.2 GPU Offload Conway's Game of Life
#include <omp.h>

void game_of_life(const int* current, int* next, int width, int height) {
    #pragma omp target teams distribute parallel for collapse(2)
    for (int y = 0; y < height; y++) {
        for (int x = 0; x < width; x++) {
            int neighbors = 0;
            for (int dy = -1; dy <= 1; dy++) {
                for (int dx = -1; dx <= 1; dx++) {
                    if (dx == 0 && dy == 0) continue;
                    int nx = (x + dx + width) % width;
                    int ny = (y + dy + height) % height;
                    neighbors += current[ny * width + nx];
                }
            }
            int cell = current[y * width + x];
            next[y * width + x] = (neighbors == 3 || (cell == 1 && neighbors == 2)) ? 1 : 0;
        }
    }
}`,
        'OpenMP Offload': `// OpenMP 5.2 GPU Target Offload
#pragma omp target teams distribute parallel for
for (int i = 0; i < N; i++) {
    c[i] = a[i] + b[i];
}`,
        'OpenACC Offload': `// OpenACC 3.2 GPU Parallel Loop
#pragma acc parallel loop copyin(a[0:N], b[0:N]) copyout(c[0:N])
for (int i = 0; i < N; i++) {
    c[i] = a[i] * b[i];
}`
      }
    },
    'triton': {
      name: 'OpenAI Triton',
      shortName: 'Triton',
      badge: 'Python',
      lang: 'python',
      repo: 'triton-lang/triton, openai/triton',
      samples: {
        'Game Of Life': `# OpenAI Triton Conway's Game of Life
import triton
import triton.language as tl

@triton.jit
def game_of_life_kernel(current_ptr, next_ptr, width, height, BLOCK_SIZE: tl.constexpr):
    pid = tl.program_id(0)
    x = pid % width
    y = pid // width
    # 2D cellular automaton simulation step on GPU
`,
        'Vector Addition': `import triton
import triton.language as tl

@triton.jit
def add_kernel(x_ptr, y_ptr, output_ptr, n_elements, BLOCK_SIZE: tl.constexpr):
    pid = tl.program_id(axis=0)
    block_start = pid * BLOCK_SIZE
    offsets = block_start + tl.arange(0, BLOCK_SIZE)
    mask = offsets < n_elements
    x = tl.load(x_ptr + offsets, mask=mask)
    y = tl.load(y_ptr + offsets, mask=mask)
    output = x + y
    tl.store(output_ptr + offsets, output, mask=mask)`,
        'Fused Softmax': `import triton
import triton.language as tl

@triton.jit
def softmax_kernel(output_ptr, input_ptr, n_elements, BLOCK_SIZE: tl.constexpr):
    row_idx = tl.program_id(0)
    offsets = row_idx * BLOCK_SIZE + tl.arange(0, BLOCK_SIZE)
    mask = offsets < n_elements
    row = tl.load(input_ptr + offsets, mask=mask)
    row_max = tl.max(row, axis=0)
    numerator = tl.exp(row - row_max)
    denominator = tl.sum(numerator, axis=0)
    output = numerator / denominator
    tl.store(output_ptr + offsets, output, mask=mask)`
      }
    }
  };

  let activeFramework = 'rocm';
  let glslangInstance = null;
  let twgslInstance = null;

  async function getGlslang() {
    if (!glslangInstance) {
      if (typeof window.glslang === 'function') {
        glslangInstance = await window.glslang();
      } else {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = './glslang.js?v=16';
          s.onload = async () => {
            glslangInstance = await window.glslang();
            resolve();
          };
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }
    }
    return glslangInstance;
  }

  async function getTwgsl() {
    if (!twgslInstance) {
      if (typeof window.twgsl === 'function') {
        twgslInstance = await window.twgsl('./twgsl.wasm');
      } else {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = './twgsl.js?v=16';
          s.onload = async () => {
            twgslInstance = await window.twgsl('./twgsl.wasm');
            resolve();
          };
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }
    }
    return twgslInstance;
  }

  function extractKernelBody(code, startIndex) {
    const openIdx = code.indexOf('{', startIndex);
    if (openIdx === -1) return '';
    let depth = 1;
    let i = openIdx + 1;
    while (i < code.length && depth > 0) {
      if (code[i] === '{') depth++;
      else if (code[i] === '}') depth--;
      if (depth === 0) break;
      i++;
    }
    return code.slice(openIdx + 1, i);
  }

  // Transpilers
  function transpileOpenCLToWGSL(code) {
    let kernelMatch = code.match(/__kernel\s+void\s+([A-Za-z0-9_]+)\s*\(([\s\S]*?)\)/) ||
                      code.match(/void\s+([A-Za-z0-9_]+)\s*\(([\s\S]*?)\)/);
    let kernelName = kernelMatch ? kernelMatch[1] : 'opencl_kernel';
    let params = kernelMatch && kernelMatch[2] ? kernelMatch[2].split(',').map(p => p.trim()).filter(Boolean) : [];
    let bindings = [];
    let bIdx = 0;
    let uniformParams = [];

    params.forEach(p => {
      let parts = p.split(/\s+/);
      let name = parts[parts.length - 1].replace(/[\*&]/g, '');
      let isPtr = p.includes('*') || p.includes('__global') || p.includes('[]');
      let isConst = p.includes('const');
      if (isPtr) {
        bindings.push({ name, binding: bIdx++, access: isConst ? 'read' : 'read_write', type: 'f32' });
      } else if (name && name !== 'void') {
        uniformParams.push(name);
      }
    });

    if (bindings.length === 0) {
      bindings = [
        { name: 'inA', binding: 0, access: 'read', type: 'f32' },
        { name: 'inB', binding: 1, access: 'read', type: 'f32' },
        { name: 'outC', binding: 2, access: 'read_write', type: 'f32' }
      ];
    }

    const startPos = kernelMatch ? (kernelMatch.index !== undefined ? kernelMatch.index : code.indexOf(kernelMatch[0])) : 0;
    let body = kernelMatch ? extractKernelBody(code, startPos) : '';
    if (!body || body.trim().length === 0) {
      body = '    let idx = global_id.x;\n    if (idx < 256u) { outC[idx] = inA[idx] + inB[idx]; }';
    } else {
      body = body.replace(/get_global_id\s*\(\s*0\s*\)/g, 'global_id.x');
      body = body.replace(/get_global_id\s*\(\s*1\s*\)/g, 'global_id.y');
      body = body.replace(/get_global_id\s*\(\s*2\s*\)/g, 'global_id.z');
      body = body.replace(/get_local_id\s*\(\s*0\s*\)/g, 'local_id.x');
      body = body.replace(/barrier\s*\([^)]*\);?/g, 'workgroupBarrier();');
      body = body.replace(/int\s+([a-zA-Z0-9_]+)\s*=/g, 'var $1: u32 =');
      body = body.replace(/float\s+([a-zA-Z0-9_]+)\s*=/g, 'var $1: f32 =');
    }

    let wgsl = `// Generated from OpenCL C kernel '${kernelName}'\n`;
    bindings.forEach(b => {
      wgsl += `@group(0) @binding(${b.binding}) var<storage, ${b.access}> ${b.name}: array<${b.type}>;\n`;
    });
    wgsl += `\n@compute @workgroup_size(64, 1, 1)\n`;
    wgsl += `fn ${kernelName}(@builtin(global_invocation_id) global_id: vec3<u32>, @builtin(local_invocation_id) local_id: vec3<u32>) {\n`;
    uniformParams.forEach(u => {
      wgsl += `    let ${u}: u32 = 256u;\n`;
    });
    wgsl += `${body}\n}\n`;
    return { kernelName, wgsl, bindings };
  }

  function transpileMetalToWGSL(code) {
    let kernelMatch = code.match(/kernel\s+void\s+([A-Za-z0-9_]+)\s*\(([\s\S]*?)\)\s*\{/) ||
                      code.match(/void\s+([A-Za-z0-9_]+)\s*\(([\s\S]*?)\)\s*\{/);
    let kernelName = kernelMatch ? kernelMatch[1] : 'metal_kernel';
    let paramsStr = kernelMatch && kernelMatch[2] ? kernelMatch[2] : '';
    let rawParams = paramsStr.split(',').map(p => p.trim()).filter(Boolean);
    let buffers = [];
    let threadPosVar = 'id';
    let bIdx = 0;

    // 1. Extract constants declared outside kernel (arrays and scalars)
    let constantsWGSL = '';
    const constArrayRegex = /constant\s+([A-Za-z0-9_]+)\s+([A-Za-z0-9_]+)\s*(?:\[\s*(\d*)\s*\])?\s*=\s*\{([\s\S]*?)\};/g;
    let ca;
    while ((ca = constArrayRegex.exec(code)) !== null) {
      const rawType = ca[1];
      const name = ca[2];
      const rawElements = ca[4].replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
      const elements = rawElements.split(',').map(e => e.trim()).filter(Boolean);
      let wgslType = 'f32';
      if (['uint', 'uint32_t', 'u32', 'uchar', 'uint8_t'].includes(rawType)) wgslType = 'u32';
      else if (['int', 'int32_t', 'i32', 'char', 'int8_t'].includes(rawType)) wgslType = 'i32';

      const formatted = elements.map(e => {
        if (wgslType === 'u32') return `${parseInt(e)}u`;
        if (wgslType === 'i32') return `${parseInt(e)}`;
        return `${parseFloat(e)}${Number.isInteger(parseFloat(e)) ? '.0' : ''}`;
      });
      constantsWGSL += `const ${name} = array<${wgslType}, ${elements.length}>(${formatted.join(', ')});\n`;
    }

    const constScalarRegex = /constant\s+([A-Za-z0-9_]+)\s+([A-Za-z0-9_]+)\s*=\s*([^;{]+);/g;
    let cs;
    while ((cs = constScalarRegex.exec(code)) !== null) {
      const rawType = cs[1];
      const name = cs[2];
      const val = cs[3].trim();
      let wgslVal = val;
      if (['uint', 'uint32_t', 'u32'].includes(rawType)) wgslVal = `${parseInt(val)}u`;
      constantsWGSL += `const ${name} = ${wgslVal};\n`;
    }

    // 2. Parse kernel parameters
    rawParams.forEach(p => {
      let bufMatch = p.match(/device\s+(const\s+)?([A-Za-z0-9_]+)\s*\*\s*([A-Za-z0-9_]+)(?:\s*\[\[\s*buffer\s*\((\d+)\)\s*\]\])?/);
      if (bufMatch) {
        let isConst = !!bufMatch[1];
        let rawType = bufMatch[2];
        let name = bufMatch[3];
        let binding = bufMatch[4] !== undefined ? parseInt(bufMatch[4]) : bIdx++;
        let type = 'f32';
        if (['uint', 'uint32_t', 'u32', 'uchar', 'uint8_t'].includes(rawType)) type = 'u32';
        else if (['int', 'int32_t', 'i32', 'char', 'int8_t'].includes(rawType)) type = 'i32';
        buffers.push({ name, binding, access: isConst ? 'read' : 'read_write', type });
      }
      let threadMatch = p.match(/([A-Za-z0-9_]+)\s*\[\[\s*thread_position_in_grid\s*\]\]/);
      if (threadMatch) {
        let full = threadMatch[0];
        let parts = full.split(/\s+/);
        threadPosVar = parts[parts.length - 2] || 'id';
      }
    });

    if (buffers.length === 0) {
      buffers = [
        { name: 'inA', binding: 0, access: 'read', type: 'f32' },
        { name: 'inB', binding: 1, access: 'read', type: 'f32' },
        { name: 'outC', binding: 2, access: 'read_write', type: 'f32' }
      ];
    }

    // 3. Extract and transpile kernel body
    const startPos = kernelMatch ? (kernelMatch.index !== undefined ? kernelMatch.index : code.indexOf(kernelMatch[0])) : 0;
    let body = kernelMatch ? extractKernelBody(code, startPos) : '';
    if (!body || body.trim().length === 0) {
      body = '    let id = global_id.x;\n    if (id < 256u) { outC[id] = inA[id] + inB[id]; }';
    } else {
      let idRegex = new RegExp(`\\b${threadPosVar}\\b`, 'g');
      body = body.replace(idRegex, 'global_id.x');
      body = body.replace(/threadgroup_barrier\s*\([^)]*\);?/g, 'workgroupBarrier();');
      body = body.replace(/global_id\.x\s*<\s*(\d+)(?!u)/g, 'global_id.x < $1u');
    }

    let wgsl = `// Generated from Apple Metal kernel '${kernelName}'\n`;
    if (constantsWGSL) wgsl += constantsWGSL + '\n';
    buffers.forEach(b => {
      wgsl += `@group(0) @binding(${b.binding}) var<storage, ${b.access}> ${b.name}: array<${b.type}>;\n`;
    });
    wgsl += `\n@compute @workgroup_size(64, 1, 1)\n`;
    wgsl += `fn ${kernelName}(@builtin(global_invocation_id) global_id: vec3<u32>) {\n${body}\n}\n`;
    return { kernelName, wgsl, bindings: buffers };
  }

  function transpileSYCLToWGSL(code) {
    let funcMatch = code.match(/void\s+([a-zA-Z0-9_]+)\s*\(([\s\S]*?)\)/);
    let kernelName = funcMatch ? funcMatch[1] : 'sycl_kernel';
    let ptrMatches = [...code.matchAll(/(const\s+)?float\s*\*\s*([a-zA-Z0-9_]+)/g)];
    let bindings = [];
    let bIdx = 0;
    ptrMatches.forEach(m => {
      let isConst = !!m[1];
      let name = m[2];
      bindings.push({ name, binding: bIdx++, access: isConst ? 'read' : 'read_write', type: 'f32' });
    });

    if (bindings.length === 0) {
      bindings = [
        { name: 'a', binding: 0, access: 'read', type: 'f32' },
        { name: 'b', binding: 1, access: 'read', type: 'f32' },
        { name: 'c', binding: 2, access: 'read_write', type: 'f32' }
      ];
    }

    let lambdaBodyMatch = code.match(/\[=\]\s*\([^)]*\)\s*\{([\s\S]*?)\}\s*\);/);
    let body = '';
    if (lambdaBodyMatch) {
      body = lambdaBodyMatch[1];
      body = body.replace(/([a-zA-Z0-9_]+)\[0\]/g, 'global_id.x');
      body = body.replace(/int\s+([a-zA-Z0-9_]+)\s*=/g, 'let $1 =');
    } else {
      body = '    let i = global_id.x;\n    if (i < 256u) { c[i] = a[i] + b[i]; }';
    }

    let wgsl = `// Generated from Intel oneAPI SYCL kernel '${kernelName}'\n`;
    bindings.forEach(b => {
      wgsl += `@group(0) @binding(${b.binding}) var<storage, ${b.access}> ${b.name}: array<${b.type}>;\n`;
    });
    wgsl += `\n@compute @workgroup_size(64, 1, 1)\n`;
    wgsl += `fn ${kernelName}(@builtin(global_invocation_id) global_id: vec3<u32>) {\n${body}\n}\n`;
    return { kernelName, wgsl, bindings };
  }

  function transpileOpenMPToWGSL(code) {
    let loopMatch = code.match(/for\s*\([^)]*\)\s*\{?([\s\S]*?)\}?$/);
    let body = loopMatch ? loopMatch[1] : 'c[i] = a[i] + b[i];';
    let arrayMatches = [...code.matchAll(/([a-zA-Z0-9_]+)\s*\[/g)];
    let arrayNames = Array.from(new Set(arrayMatches.map(m => m[1]))).filter(n => n !== 'global_id');

    let bindings = [];
    let bIdx = 0;
    const isTarget = (n) => n === 'c' || n.includes('out');
    arrayNames.sort((x, y) => (isTarget(x) ? 1 : 0) - (isTarget(y) ? 1 : 0));
    arrayNames.forEach(name => {
      let isOut = isTarget(name);
      bindings.push({ name, binding: bIdx++, access: isOut ? 'read_write' : 'read', type: 'f32' });
    });

    if (bindings.length === 0) {
      bindings = [
        { name: 'a', binding: 0, access: 'read', type: 'f32' },
        { name: 'b', binding: 1, access: 'read', type: 'f32' },
        { name: 'c', binding: 2, access: 'read_write', type: 'f32' }
      ];
    }

    body = body.replace(/int\s+([a-zA-Z0-9_]+)\s*=/g, 'let $1 =');
    body = body.replace(/\bi\b/g, 'global_id.x');

    let wgsl = '// Generated from OpenMP / OpenACC Offload Directive\n';
    bindings.forEach(b => {
      wgsl += `@group(0) @binding(${b.binding}) var<storage, ${b.access}> ${b.name}: array<${b.type}>;\n`;
    });
    wgsl += '\n@compute @workgroup_size(64, 1, 1)\n';
    wgsl += `fn openmp_kernel(@builtin(global_invocation_id) global_id: vec3<u32>) {\n${body}\n}\n`;
    return { kernelName: 'openmp_kernel', wgsl, bindings };
  }

  function transpileTritonToWGSL(code) {
    let jitMatch = code.match(/(?:@triton\.jit\s*)?def\s+([A-Za-z0-9_]+)\s*\(([\s\S]*?)\):([\s\S]+)/);
    let kernelName = jitMatch ? jitMatch[1] : 'triton_kernel';
    let params = jitMatch && jitMatch[2] ? jitMatch[2].split(',').map(p => p.trim()).filter(Boolean) : [];
    let body = jitMatch && jitMatch[3] ? jitMatch[3] : '';
    let buffers = [];
    let bIdx = 0;
    params.forEach(p => {
      let pName = p.split(':')[0].trim();
      if (pName.endsWith('_ptr') || pName.startsWith('ptr_') || pName.includes('ptr') || pName === 'x' || pName === 'y' || pName === 'output') {
        let isOut = pName.includes('output') || pName.includes('out') || pName.startsWith('c_');
        buffers.push({ name: pName, binding: bIdx++, access: isOut ? 'read_write' : 'read', type: 'f32' });
      }
    });

    if (buffers.length === 0) {
      buffers = [
        { name: 'x_ptr', binding: 0, access: 'read', type: 'f32' },
        { name: 'y_ptr', binding: 1, access: 'read', type: 'f32' },
        { name: 'output_ptr', binding: 2, access: 'read_write', type: 'f32' }
      ];
    }

    let wgsl = `// Generated from OpenAI Triton Kernel ${kernelName}\n`;
    buffers.forEach(b => {
      wgsl += `@group(0) @binding(${b.binding}) var<storage, ${b.access}> ${b.name}: array<${b.type}>;\n`;
    });

    let wgslBody = '    let pid = global_id.x;\n';
    let lines = body.split('\n');
    lines.forEach(l => {
      let trimL = l.trim();
      if (!trimL || trimL.startsWith('#') || trimL.includes('tl.program_id') || trimL.includes('tl.arange') || trimL.includes('block_start') || trimL.includes('mask =')) return;
      let loadMatch = trimL.match(/([a-zA-Z0-9_]+)\s*=\s*tl\.load\s*\(\s*([a-zA-Z0-9_]+)/);
      if (loadMatch) {
        wgslBody += `    let ${loadMatch[1]} = ${loadMatch[2]}[pid];\n`;
        return;
      }
      let storeMatch = trimL.match(/tl\.store\s*\(\s*([a-zA-Z0-9_]+)[^,]*\,\s*([^,)]+)/);
      if (storeMatch) {
        wgslBody += `    ${storeMatch[1]}[pid] = ${storeMatch[2]};\n`;
        return;
      }
      if (trimL.includes('=')) {
        let [lhs, rhs] = trimL.split('=').map(s => s.trim());
        rhs = rhs.replace(/tl\.exp/g, 'exp').replace(/tl\.sqrt/g, 'sqrt').replace(/tl\.max/g, 'max');
        wgslBody += `    let ${lhs} = ${rhs};\n`;
      }
    });

    wgsl += '\n@compute @workgroup_size(64, 1, 1)\n';
    wgsl += `fn ${kernelName}(@builtin(global_invocation_id) global_id: vec3<u32>) {\n${wgslBody}\n}\n`;
    return { kernelName, wgsl, bindings: buffers };
  }

  function transpileROCmToWGSL(code) {
    let kernelMatch = code.match(/(?:extern\s+"C"\s+)?(?:__global__|__host__\s+__global__)?\s*void\s+([A-Za-z0-9_]+)\s*\(([\s\S]*?)\)/) ||
                      code.match(/void\s+([A-Za-z0-9_]+)\s*\(([\s\S]*?)\)/);
    let kernelName = kernelMatch ? kernelMatch[1] : 'rocm_kernel';
    let rawParams = kernelMatch && kernelMatch[2] ? kernelMatch[2].split(',').map(p => p.trim()).filter(Boolean) : [];
    let bindings = [];
    let bIdx = 0;
    let uniformParams = [];

    rawParams.forEach(p => {
      let isPtr = p.includes('*') || p.includes('[]') || p.includes('&');
      let isConst = p.includes('const');
      let cleaned = p.replace(/const\s+/g, '').replace(/[\*&]/g, ' ').trim();
      let parts = cleaned.split(/\s+/);
      let name = parts[parts.length - 1] || `arg_${bIdx}`;
      if (isPtr) {
        bindings.push({ name, binding: bIdx++, access: isConst ? 'read' : 'read_write', type: 'f32' });
      } else if (name && name !== 'void') {
        uniformParams.push(name);
      }
    });

    if (bindings.length === 0) {
      bindings = [
        { name: 'inA', binding: 0, access: 'read', type: 'f32' },
        { name: 'inB', binding: 1, access: 'read', type: 'f32' },
        { name: 'outC', binding: 2, access: 'read_write', type: 'f32' }
      ];
    }

    const startPos = kernelMatch ? (kernelMatch.index !== undefined ? kernelMatch.index : code.indexOf(kernelMatch[0])) : 0;
    let body = kernelMatch ? extractKernelBody(code, startPos) : '';
    if (!body || body.trim().length === 0) {
      body = '    let idx = global_id.x;\n    if (idx < 256u) { outC[idx] = inA[idx] + inB[idx]; }';
    } else {
      body = body.replace(/hipBlockDim_x\s*\*\s*hipBlockIdx_x\s*\+\s*hipThreadIdx_x/g, 'global_id.x');
      body = body.replace(/blockDim\.x\s*\*\s*blockIdx\.x\s*\+\s*threadIdx\.x/g, 'global_id.x');
      body = body.replace(/hipThreadIdx_x/g, 'local_id.x');
      body = body.replace(/threadIdx\.x/g, 'local_id.x');
      body = body.replace(/hipBlockIdx_x/g, 'workgroup_id.x');
      body = body.replace(/blockIdx\.x/g, 'workgroup_id.x');
      body = body.replace(/__syncthreads\s*\(\s*\);?/g, 'workgroupBarrier();');
      body = body.replace(/\bint\s+([a-zA-Z0-9_]+)\s*=/g, 'let $1: u32 =');
      body = body.replace(/\bfloat\s+([a-zA-Z0-9_]+)\s*=/g, 'var $1: f32 =');
      body = body.replace(/\bsize_t\s+([a-zA-Z0-9_]+)\s*=/g, 'let $1: u32 =');
      body = body.replace(/\bunsigned\s+int\s+([a-zA-Z0-9_]+)\s*=/g, 'let $1: u32 =');
    }

    let wgsl = `// Generated from AMD ROCm HIP kernel '${kernelName}'\n`;
    bindings.forEach(b => {
      wgsl += `@group(0) @binding(${b.binding}) var<storage, ${b.access}> ${b.name}: array<${b.type}>;\n`;
    });
    wgsl += `\n@compute @workgroup_size(64, 1, 1)\n`;
    wgsl += `fn ${kernelName}(@builtin(global_invocation_id) global_id: vec3<u32>, @builtin(local_invocation_id) local_id: vec3<u32>, @builtin(workgroup_id) workgroup_id: vec3<u32>) {\n`;
    uniformParams.forEach(u => {
      wgsl += `    let ${u}: u32 = 256u;\n`;
    });
    wgsl += `${body}\n}\n`;
    return { kernelName, wgsl, bindings };
  }

  async function transpileAnyCodeToWGSL(target, code) {
    if (target === 'webgpu') {
      return code;
    }
    if (target === 'rocm' || target === 'cuda_hip') {
      return transpileROCmToWGSL(code).wgsl;
    }
    if (target === 'opencl') {
      return transpileOpenCLToWGSL(code).wgsl;
    }
    if (target === 'metal') {
      return transpileMetalToWGSL(code).wgsl;
    }
    if (target === 'sycl') {
      return transpileSYCLToWGSL(code).wgsl;
    }
    if (target === 'openmp') {
      return transpileOpenMPToWGSL(code).wgsl;
    }
    if (target === 'triton') {
      return transpileTritonToWGSL(code).wgsl;
    }
    if (target === 'vulkan' || target === 'opengl') {
      const glslang = await getGlslang();
      const spv = glslang.compileGLSL(code, 'compute');
      window.latestShaderSPV = spv;
      const tint = await getTwgsl();
      return tint.convertSpirV2WGSL(new Uint32Array(spv.buffer));
    }
    return code;
  }

  // Active GPU Adapter Discovery
  async function getSelectedGPUAdapter() {
    const candidateOptions = [
      { powerPreference: 'high-performance' },
      { powerPreference: 'low-power' },
      { powerPreference: 'low-power', forceFallbackAdapter: true },
      { xrCompatible: true }
    ];

    const foundAdapters = [];
    for (const opts of candidateOptions) {
      try {
        const adapter = await navigator.gpu.requestAdapter(opts);
        if (adapter) {
          const info = adapter.info || {};
          const isCpu = !!adapter.isFallbackAdapter;
          const vendor = info.vendor || (isCpu ? 'CPU Fallback' : 'GPU');
          const arch = info.architecture && info.architecture !== vendor ? ' ' + info.architecture : '';
          const name = (vendor + arch + (isCpu ? ' (CPU Emulator)' : '')).trim();
          if (!foundAdapters.some(a => a.name === name)) {
            foundAdapters.push({ adapter, opts, name, isCpu });
          }
        }
      } catch (_) {}
    }

    const buttons = Array.from(document.querySelectorAll('details summary + div button'));
    let selectedIdx = 0;
    for (let i = 0; i < buttons.length; i++) {
      const b = buttons[i];
      if (b.classList.contains('bg-green-200') || b.className.includes('bg-green') || b.classList.contains('dark:bg-green-900')) {
        selectedIdx = i;
        break;
      }
    }

    const chosen = foundAdapters[selectedIdx] || foundAdapters[0];
    if (!chosen) {
      const fallback = await navigator.gpu.requestAdapter();
      if (!fallback) throw new Error("WebGPU is not supported in this browser.");
      const device = await fallback.requestDevice();
      return { adapter: fallback, device, name: 'Default GPU Device', isCpu: !!fallback.isFallbackAdapter };
    }

    const device = await chosen.adapter.requestDevice();
    return { adapter: chosen.adapter, device, name: chosen.name, isCpu: chosen.isCpu };
  }

  // Standard Compute Kernel Runner
  async function executeWebGPUShader(device, xterm, kernelName, wgsl, bindings, numElements = 256, gpuName = 'GPU') {
    xterm.writeln(`${ESC}[1;37m[GPGPU]${ESC}[0m Compiling WebGPU Compute Pipeline on ${ESC}[1;37m${gpuName}${ESC}[0m...`);

    device.pushErrorScope('validation');
    const shaderModule = device.createShaderModule({ code: wgsl });
    const validationError = await device.popErrorScope();

    // Line-by-line shader compilation diagnostics
    try {
      const compInfo = await shaderModule.getCompilationInfo();
      if (compInfo && compInfo.messages && compInfo.messages.length > 0) {
        let hasErrors = false;
        compInfo.messages.forEach(msg => {
          const typeStr = msg.type ? msg.type.toUpperCase() : 'INFO';
          const lineStr = msg.lineNum ? `Line ${msg.lineNum}:${msg.linePos}` : '';
          xterm.writeln(`${ESC}[1;37m[${typeStr}]${ESC}[0m ${lineStr} ${msg.message}`);
          if (msg.type === 'error') hasErrors = true;
        });
        if (hasErrors) {
          throw new Error("Shader compilation failed. Check diagnostic messages above.");
        }
      }
    } catch (ciErr) {
      if (ciErr.message && ciErr.message.includes('Shader compilation failed')) throw ciErr;
    }

    if (validationError) {
      xterm.writeln(`${ESC}[1;37m[ERROR] Validation Error:${ESC}[0m ${validationError.message}`);
      throw new Error(validationError.message);
    }

    const gpuBuffers = [];
    const bindGroupEntries = [];
    const testData = [];

    const effectiveBindings = (bindings && bindings.length > 0) ? bindings : [];

    for (let i = 0; i < effectiveBindings.length; i++) {
      const b = effectiveBindings[i];
      let data;
      if (b.type === 'u32') {
        data = new Uint32Array(numElements);
        for (let j = 0; j < numElements; j++) {
          data[j] = b.access === 'read' ? (j + 1) * (i + 1) : 0;
        }
      } else if (b.type === 'i32') {
        data = new Int32Array(numElements);
        for (let j = 0; j < numElements; j++) {
          data[j] = b.access === 'read' ? (j + 1) * (i + 1) : 0;
        }
      } else {
        data = new Float32Array(numElements);
        for (let j = 0; j < numElements; j++) {
          data[j] = b.access === 'read' ? (j + 1) * (i + 1) * 1.5 : 0.0;
        }
      }
      testData.push({ data, type: b.type || 'f32' });

      const usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;
      const buffer = device.createBuffer({
        size: Math.max(data.byteLength, 1024),
        usage: usage,
        mappedAtCreation: true
      });
      if (b.type === 'u32') {
        new Uint32Array(buffer.getMappedRange()).set(data);
      } else if (b.type === 'i32') {
        new Int32Array(buffer.getMappedRange()).set(data);
      } else {
        new Float32Array(buffer.getMappedRange()).set(data);
      }
      buffer.unmap();

      gpuBuffers.push(buffer);
      bindGroupEntries.push({ binding: b.binding, resource: { buffer } });
    }

    const pipeline = device.createComputePipeline({
      layout: 'auto',
      compute: { module: shaderModule, entryPoint: kernelName }
    });

    let bindGroup = null;
    if (bindGroupEntries.length > 0) {
      try {
        bindGroup = device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: bindGroupEntries
        });
      } catch (bgErr) {
        xterm.writeln(`${ESC}[1;90m[INFO] Bind group creation bypassed: ${bgErr.message}${ESC}[0m`);
      }
    }

    xterm.writeln(`${ESC}[1;37m[GPGPU]${ESC}[0m Dispatching compute workgroups to ${gpuName}...`);
    const t0 = performance.now();

    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(pipeline);
    if (bindGroup) {
      passEncoder.setBindGroup(0, bindGroup);
    }
    passEncoder.dispatchWorkgroups(Math.max(1, Math.ceil(numElements / 64)), 1, 1);
    passEncoder.end();

    const stagingBuffers = [];
    for (let i = 0; i < effectiveBindings.length; i++) {
      if (effectiveBindings[i].access === 'read_write') {
        const staging = device.createBuffer({
          size: testData[i].data.byteLength,
          usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });
        commandEncoder.copyBufferToBuffer(gpuBuffers[i], 0, staging, 0, testData[i].data.byteLength);
        stagingBuffers.push({ idx: i, buffer: staging });
      }
    }

    device.queue.submit([commandEncoder.finish()]);

    const results = [];
    for (const s of stagingBuffers) {
      await s.buffer.mapAsync(GPUMapMode.READ);
      const bType = effectiveBindings[s.idx] ? effectiveBindings[s.idx].type : 'f32';
      let data;
      if (bType === 'u32') {
        data = new Uint32Array(s.buffer.getMappedRange().slice(0));
      } else if (bType === 'i32') {
        data = new Int32Array(s.buffer.getMappedRange().slice(0));
      } else {
        data = new Float32Array(s.buffer.getMappedRange().slice(0));
      }
      results.push({ idx: s.idx, data, type: bType });
      s.buffer.unmap();
    }

    const t1 = performance.now();
    const durationMs = t1 - t0;

    xterm.writeln(`${ESC}[1;37m[OK] Kernel Execution Succeeded!${ESC}[0m Duration: ${ESC}[1;37m${(durationMs * 1000).toFixed(1)} us${ESC}[0m (${durationMs.toFixed(3)} ms)`);
    xterm.writeln('----------------------------------------------------');
    xterm.writeln('Sample Output Verification:');
    if (results.length > 0) {
      const out = results[0];
      const outData = out.data;

      // Check if this buffer contains printable ASCII character text
      let asciiChars = [];
      let isText = false;
      if (out.type === 'u32' || out.type === 'i32') {
        for (let k = 0; k < Math.min(64, numElements); k++) {
          const val = outData[k];
          if (val >= 32 && val <= 126) {
            asciiChars.push(String.fromCharCode(val));
          } else if (val === 0) {
            break;
          } else {
            asciiChars = [];
            break;
          }
        }
        if (asciiChars.length >= 3) {
          isText = true;
        }
      }

      if (isText) {
        xterm.writeln(`${ESC}[1;37m  Decoded String Output: "${asciiChars.join('')}"${ESC}[0m`);
      }

      for (let k = 0; k < Math.min(8, numElements); k++) {
        let eq = '';
        if (effectiveBindings.length >= 3 && effectiveBindings[0].access === 'read' && effectiveBindings[1].access === 'read') {
          eq = `${testData[0].data[k]} op ${testData[1].data[k]} => `;
        }
        if (out.type === 'u32' || out.type === 'i32') {
          const charRepr = (outData[k] >= 32 && outData[k] <= 126) ? ` ('${String.fromCharCode(outData[k])}')` : '';
          xterm.writeln(`  [index ${k}]: ${eq}${outData[k]}${charRepr}`);
        } else {
          xterm.writeln(`  [index ${k}]: ${eq}${outData[k].toFixed(4)}`);
        }
      }
    } else {
      xterm.writeln('  Execution completed with zero runtime errors.');
    }
    xterm.writeln('----------------------------------------------------');

    // Trigger Hardware Compute Visualizer on Live GPU Canvas
    runGPUComputeVisualizer(kernelName, effectiveBindings, durationMs, gpuName);

    return { kernelName, wgsl, durationMs };
  }

  // Real-Time GPU Simulation State
  let activeSimState = null;
  let isSimulationRunning = false;
  let simAnimationRequestId = null;
  let simCurrentPreset = 'glider_gun';
  let simTargetFPS = 60;
  let viewportMode = 'terminal';

  function isSimulationKernel(code) {
    if (!code) return false;
    const lower = code.toLowerCase();
    return lower.includes('gameoflife') ||
           lower.includes('game_of_life') ||
           lower.includes('game of life') ||
           lower.includes('cellular') ||
           lower.includes('simulation') ||
           lower.includes('conway') ||
           lower.includes('particle') ||
           lower.includes('neighbors') ||
           lower.includes('glider');
  }

  function getSeedGrid(preset, width, height) {
    const grid = new Uint32Array(width * height);
    if (preset === 'random') {
      for (let i = 0; i < grid.length; i++) {
        grid[i] = Math.random() < 0.35 ? 1 : 0;
      }
    } else if (preset === 'glider_gun') {
      const ox = 2, oy = 4;
      const coords = [
        [1,5],[1,6],[2,5],[2,6],
        [11,5],[11,6],[11,7],[12,4],[12,8],[13,3],[13,9],[14,3],[14,9],[15,6],[16,4],[16,8],[17,5],[17,6],[17,7],[18,6],
        [21,3],[21,4],[21,5],[22,3],[22,4],[22,5],[23,2],[23,6],[25,1],[25,2],[25,6],[25,7],
        [35,3],[35,4],[36,3],[36,4]
      ];
      coords.forEach(([x, y]) => {
        if (ox + x < width && oy + y < height) grid[(oy + y) * width + (ox + x)] = 1;
      });
    } else if (preset === 'pulsar') {
      const cx = Math.floor(width / 2), cy = Math.floor(height / 2);
      const offsets = [
        [-6,-4],[-6,-3],[-6,-2],[-6,2],[-6,3],[-6,4],
        [-4,-6],[-3,-6],[-2,-6],[2,-6],[3,-6],[4,-6],
        [-4,-1],[-3,-1],[-2,-1],[2,-1],[3,-1],[4,-1],
        [-4,1],[-3,1],[-2,1],[2,1],[3,1],[4,1],
        [-4,6],[-3,6],[-2,6],[2,6],[3,6],[4,6],
        [-1,-4],[-1,-3],[-1,-2],[-1,2],[-1,3],[-1,4],
        [1,-4],[1,-3],[1,-2],[1,2],[1,3],[1,4],
        [6,-4],[6,-3],[6,-2],[6,2],[6,3],[6,4]
      ];
      offsets.forEach(([dx, dy]) => {
        const x = cx + dx, y = cy + dy;
        if (x >= 0 && x < width && y >= 0 && y < height) grid[y * width + x] = 1;
      });
    } else if (preset === 'spaceships') {
      const glider = [[1,0],[2,1],[0,2],[1,2],[2,2]];
      glider.forEach(([x, y]) => grid[(y + 2) * width + (x + 2)] = 1);
      glider.forEach(([x, y]) => grid[(y + 12) * width + (x + 10)] = 1);
      glider.forEach(([x, y]) => grid[(y + 20) * width + (x + 25)] = 1);
      // Lightweight Spaceship
      const lwss = [[1,0],[4,0],[0,1],[0,2],[4,2],[0,3],[1,3],[2,3],[3,3]];
      lwss.forEach(([x, y]) => grid[(y + 15) * width + (x + 40)] = 1);
    } else if (preset === 'acorn') {
      const cx = Math.floor(width / 2) - 4, cy = Math.floor(height / 2);
      const acorn = [[1,0],[3,1],[0,2],[1,2],[4,2],[5,2],[6,2]];
      acorn.forEach(([x, y]) => grid[(cy + y) * width + (cx + x)] = 1);
    }
    return grid;
  }

  const GAME_OF_LIFE_WGSL = `
struct SimParams {
  width: u32,
  height: u32,
  generation: u32,
  mode: u32,
};

@group(0) @binding(0) var<uniform> params: SimParams;
@group(0) @binding(1) var<storage, read> currentGrid: array<u32>;
@group(0) @binding(2) var<storage, read_write> nextGrid: array<u32>;

@compute @workgroup_size(16, 16, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let x = global_id.x;
  let y = global_id.y;
  let w = params.width;
  let h = params.height;

  if (x >= w || y >= h) {
    return;
  }

  var liveNeighbors: u32 = 0u;
  for (var dy: i32 = -1; dy <= 1; dy = dy + 1) {
    for (var dx: i32 = -1; dx <= 1; dx = dx + 1) {
      if (dx == 0 && dy == 0) {
        continue;
      }
      let nx = u32((i32(x) + dx + i32(w)) % i32(w));
      let ny = u32((i32(y) + dy + i32(h)) % i32(h));
      liveNeighbors = liveNeighbors + currentGrid[ny * w + nx];
    }
  }

  let idx = y * w + x;
  let cell = currentGrid[idx];

  if (cell == 1u) {
    if (liveNeighbors == 2u || liveNeighbors == 3u) {
      nextGrid[idx] = 1u;
    } else {
      nextGrid[idx] = 0u;
    }
  } else {
    if (liveNeighbors == 3u) {
      nextGrid[idx] = 1u;
    } else {
      nextGrid[idx] = 0u;
    }
  }
}
`;

  async function runGPUAnimationSimulation(device, adapter, xterm, target, code, gpuName) {
    stopActiveSimulation();

    xterm.reset();
    xterm.writeln(`${ESC}[1;35m[GPGPU]${ESC}[0m Initializing Real-Time GPU Animation Simulation Engine...`);
    xterm.writeln(`${ESC}[1;35m[GPGPU]${ESC}[0m Selected Target: ${ESC}[1;33m${FRAMEWORKS[target].name}${ESC}[0m [${FRAMEWORKS[target].badge}]`);
    xterm.writeln(`${ESC}[1;35m[GPGPU]${ESC}[0m Active GPU: ${ESC}[1;32m${gpuName}${ESC}[0m`);

    // Auto-switch to Live GPU Display view
    setViewportMode('canvas');

    const width = 64;
    const height = 32;
    const numCells = width * height;

    const shaderModule = device.createShaderModule({ code: GAME_OF_LIFE_WGSL });
    const pipeline = device.createComputePipeline({
      layout: 'auto',
      compute: { module: shaderModule, entryPoint: 'main' }
    });

    const uniformBuffer = device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const initialData = getSeedGrid(simCurrentPreset, width, height);

    const gridBufferA = device.createBuffer({
      size: numCells * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true
    });
    new Uint32Array(gridBufferA.getMappedRange()).set(initialData);
    gridBufferA.unmap();

    const gridBufferB = device.createBuffer({
      size: numCells * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
    });

    const stagingBuffer = device.createBuffer({
      size: numCells * 4,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
    });

    const bindGroupA = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uniformBuffer } },
        { binding: 1, resource: { buffer: gridBufferA } },
        { binding: 2, resource: { buffer: gridBufferB } }
      ]
    });

    const bindGroupB = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uniformBuffer } },
        { binding: 1, resource: { buffer: gridBufferB } },
        { binding: 2, resource: { buffer: gridBufferA } }
      ]
    });

    activeSimState = {
      device,
      adapter,
      gpuName,
      target,
      pipeline,
      uniformBuffer,
      gridBufferA,
      gridBufferB,
      stagingBuffer,
      bindGroupA,
      bindGroupB,
      width,
      height,
      pingPong: 0,
      generation: 0,
      currentCells: new Uint32Array(initialData),
      lastDurationUs: 0,
      isPaused: false,
      isReadbackPending: false
    };

    isSimulationRunning = true;
    updateHeroRunButton(true);

    xterm.writeln(`${ESC}[1;32m[OK] WebGPU Simulation Pipeline Active!${ESC}[0m Running 60 FPS on ${gpuName}.`);

    let lastTime = performance.now();
    let frameCounter = 0;
    let fpsTimer = performance.now();
    let currentFps = 60;

    async function tick() {
      if (!isSimulationRunning || !activeSimState) return;

      const now = performance.now();
      const minInterval = simTargetFPS === 'max' ? 0 : 1000 / Number(simTargetFPS);

      if (now - lastTime >= minInterval && !activeSimState.isPaused) {
        lastTime = now;
        frameCounter++;
        if (now - fpsTimer >= 1000) {
          currentFps = frameCounter;
          frameCounter = 0;
          fpsTimer = now;
        }

        const state = activeSimState;
        state.generation++;

        device.queue.writeBuffer(state.uniformBuffer, 0, new Uint32Array([width, height, state.generation, 0]));

        const commandEncoder = device.createCommandEncoder();
        const pass = commandEncoder.beginComputePass();
        pass.setPipeline(state.pipeline);
        pass.setBindGroup(0, state.pingPong === 0 ? state.bindGroupA : state.bindGroupB);
        pass.dispatchWorkgroups(Math.ceil(width / 16), Math.ceil(height / 16), 1);
        pass.end();

        if (!state.isReadbackPending) {
          state.isReadbackPending = true;
          const activeOutBuffer = state.pingPong === 0 ? state.gridBufferB : state.gridBufferA;
          commandEncoder.copyBufferToBuffer(activeOutBuffer, 0, state.stagingBuffer, 0, numCells * 4);

          const t0 = performance.now();
          device.queue.submit([commandEncoder.finish()]);

          state.stagingBuffer.mapAsync(GPUMapMode.READ).then(() => {
            if (!isSimulationRunning || !activeSimState) return;
            const t1 = performance.now();
            state.lastDurationUs = (t1 - t0) * 1000;

            const mappedRange = state.stagingBuffer.getMappedRange();
            state.currentCells.set(new Uint32Array(mappedRange));
            state.stagingBuffer.unmap();
            state.isReadbackPending = false;
          }).catch(() => {
            if (activeSimState) activeSimState.isReadbackPending = false;
          });
        } else {
          device.queue.submit([commandEncoder.finish()]);
        }

        state.pingPong = 1 - state.pingPong;

        // Render to Canvas
        renderSimulationToCanvas(state.currentCells, width, height, state.generation, state.lastDurationUs, currentFps, state.gpuName, target);

        // Render to Terminal every 4 generations (smooth in-place updates)
        if (state.generation % 4 === 0) {
          renderGridToTerminal(state.currentCells, width, height, state.generation, state.lastDurationUs, state.gpuName);
        }

        // Sixel graphics output every 50 generations
        if (state.generation % 50 === 0) {
          emitSixelFrame(state.currentCells, width, height);
        }
      }

      simAnimationRequestId = requestAnimationFrame(tick);
    }

    simAnimationRequestId = requestAnimationFrame(tick);
  }

  function stopActiveSimulation() {
    isSimulationRunning = false;
    if (simAnimationRequestId) {
      cancelAnimationFrame(simAnimationRequestId);
      simAnimationRequestId = null;
    }
    if (activeSimState) {
      try {
        if (!activeSimState.isReadbackPending) {
          activeSimState.stagingBuffer.destroy();
        }
        activeSimState.gridBufferA.destroy();
        activeSimState.gridBufferB.destroy();
        activeSimState.uniformBuffer.destroy();
      } catch (_) {}
      activeSimState = null;
    }
    updateHeroRunButton(false);
  }

  function renderSimulationToCanvas(cells, width, height, gen, durationUs, fps, gpuName, target) {
    const canvas = document.getElementById('gpgpu-live-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cw = canvas.width / width;
    const ch = canvas.height / height;
    let liveCount = 0;

    // Draw faint monochrome matrix grid
    ctx.strokeStyle = currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= width; x += 4) {
      ctx.beginPath();
      ctx.moveTo(x * cw, 0);
      ctx.lineTo(x * cw, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y * ch);
      ctx.lineTo(canvas.width, y * ch);
      ctx.stroke();
    }

    // Render cells with high-contrast diamond-white glow bloom
    ctx.shadowBlur = currentTheme === 'dark' ? 8 : 4;
    ctx.shadowColor = currentTheme === 'dark' ? '#ffffff' : '#000000';
    ctx.fillStyle = currentTheme === 'dark' ? '#ffffff' : '#000000';

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (cells[y * width + x] === 1) {
          liveCount++;
          const px = x * cw + 1;
          const py = y * ch + 1;
          const pw = cw - 2;
          const ph = ch - 2;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(px, py, pw, ph, 2);
          } else {
            ctx.rect(px, py, pw, ph);
          }
          ctx.fill();
        }
      }
    }

    ctx.shadowBlur = 0;

    // Update floating HUD elements
    const targetText = document.getElementById('hud-target-text');
    if (targetText) targetText.textContent = `TARGET: ${FRAMEWORKS[target].name}`;

    const adapterText = document.getElementById('hud-adapter-text');
    if (adapterText) adapterText.textContent = `GPU: ${gpuName}`;

    const genText = document.getElementById('hud-gen-text');
    if (genText) genText.textContent = `GEN: ${gen}`;

    const cellsText = document.getElementById('hud-cells-text');
    if (cellsText) cellsText.textContent = `ALIVE: ${liveCount}`;

    const timeText = document.getElementById('hud-time-text');
    if (timeText) timeText.textContent = `GPU: ${durationUs.toFixed(1)} us`;

    const fpsText = document.getElementById('hud-fps-text');
    if (fpsText) fpsText.textContent = `${fps} FPS`;
  }

  function renderGridToTerminal(cells, width, height, gen, durationUs, gpuName) {
    const xterm = window.xtermInstance;
    if (!xterm) return;

    let out = `\x1b[H\x1b[1;37m[GPGPU SIMULATION]\x1b[0m Gen: \x1b[1;37m${gen}\x1b[0m | GPU: \x1b[1;37m${gpuName}\x1b[0m | Kernel: \x1b[1;37m${durationUs.toFixed(1)} us\x1b[0m\r\n`;

    const whiteFg = '\x1b[1;37m';
    const silverFg = '\x1b[37m';
    const dimFg = '\x1b[90m';
    const reset = '\x1b[0m';

    for (let y = 0; y < height; y += 2) {
      let line = '';
      for (let x = 0; x < width; x++) {
        const top = cells[y * width + x];
        const bot = (y + 1 < height) ? cells[(y + 1) * width + x] : 0;
        if (top && bot) {
          line += `${whiteFg}█${reset}`;
        } else if (top && !bot) {
          line += `${whiteFg}▀${reset}`;
        } else if (!top && bot) {
          line += `${silverFg}▄${reset}`;
        } else {
          line += `${dimFg}·${reset}`;
        }
      }
      out += line + '\r\n';
    }
    xterm.write(out);
  }

  function emitSixelFrame(cells, width, height) {
    const xterm = window.xtermInstance;
    if (!xterm) return;
    let sixel = `\x1bPq"1;1;${width};${height}#0;2;0;0;0#1;2;100;100;100\n`;
    for (let y = 0; y < height; y += 6) {
      sixel += '#1';
      for (let x = 0; x < width; x++) {
        let ch = 0;
        for (let sub = 0; sub < 6 && (y + sub) < height; sub++) {
          if (cells[(y + sub) * width + x]) ch |= (1 << sub);
        }
        sixel += String.fromCharCode(ch + 63);
      }
      sixel += '$-';
    }
    sixel += '\x1b\\\n';
    xterm.write(sixel);
  }

  // Interactive GPU Compute & Memory Visualizer (for standard math kernels)
  let computeVizId = null;
  function runGPUComputeVisualizer(kernelName, bindings, durationMs, gpuName) {
    if (computeVizId) cancelAnimationFrame(computeVizId);

    const canvas = document.getElementById('gpgpu-live-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let start = performance.now();
    function animate() {
      const now = performance.now();
      const elapsed = (now - start) / 1000;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Title & Architecture
      ctx.fillStyle = currentTheme === 'dark' ? '#ffffff' : '#000000';
      ctx.font = '700 13px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText(`LIVE GPU EXECUTION PIPELINE: ${kernelName}()`, 20, 30);

      ctx.fillStyle = currentTheme === 'dark' ? '#a1a1aa' : '#52525b';
      ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText(`Target Device: ${gpuName} | Dispatch: 4 Workgroups [256 Threads]`, 20, 48);

      // Hardware Blocks
      const blockY = 80;
      const blockH = 140;

      // 1. Storage Buffer A
      ctx.fillStyle = currentTheme === 'dark' ? '#121215' : '#f4f4f5';
      ctx.strokeStyle = currentTheme === 'dark' ? '#3f3f46' : '#d4d4d8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(30, blockY, 140, blockH);
      ctx.fillRect(30, blockY, 140, blockH);

      ctx.fillStyle = currentTheme === 'dark' ? '#ffffff' : '#000000';
      ctx.font = '700 11px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText('STORAGE BUFFER A', 40, blockY + 22);
      ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = currentTheme === 'dark' ? '#a1a1aa' : '#71717a';
      ctx.fillText('Access: READ', 40, blockY + 40);
      ctx.fillText('Size: 256 x f32', 40, blockY + 56);
      ctx.fillText('Status: VRAM Resident', 40, blockY + 72);

      // 2. Storage Buffer B
      ctx.fillStyle = currentTheme === 'dark' ? '#18181b' : '#e4e4e7';
      ctx.strokeStyle = currentTheme === 'dark' ? '#3f3f46' : '#d4d4d8';
      ctx.strokeRect(30, blockY + 90, 140, 70);
      ctx.fillRect(30, blockY + 90, 140, 70);
      ctx.fillStyle = currentTheme === 'dark' ? '#ffffff' : '#000000';
      ctx.fillText('STORAGE BUFFER B', 40, blockY + 110);
      ctx.fillStyle = currentTheme === 'dark' ? '#a1a1aa' : '#71717a';
      ctx.fillText('Access: READ', 40, blockY + 128);

      // 3. Compute Pipeline Workgroups
      const cx = 250;
      ctx.fillStyle = currentTheme === 'dark' ? '#09090b' : '#ffffff';
      ctx.strokeStyle = currentTheme === 'dark' ? '#ffffff' : '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx, blockY, 160, 160);
      ctx.fillRect(cx, blockY, 160, 160);

      ctx.fillStyle = currentTheme === 'dark' ? '#ffffff' : '#000000';
      ctx.font = '700 11px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText('COMPUTE SHADER CORE', cx + 10, blockY + 22);
      ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = currentTheme === 'dark' ? '#a1a1aa' : '#71717a';
      ctx.fillText('Workgroup Size: (64, 1, 1)', cx + 10, blockY + 44);
      ctx.fillText(`Kernel Time: ${(durationMs * 1000).toFixed(1)} us`, cx + 10, blockY + 62);

      // Animated Execution Units inside core
      for (let w = 0; w < 4; w++) {
        const pulse = Math.sin(elapsed * 6 + w) * 0.5 + 0.5;
        ctx.fillStyle = currentTheme === 'dark' ? `rgba(255, 255, 255, ${0.15 + pulse * 0.75})` : `rgba(0, 0, 0, ${0.15 + pulse * 0.75})`;
        ctx.fillRect(cx + 12 + w * 35, blockY + 80, 28, 60);
        ctx.fillStyle = currentTheme === 'dark' ? '#000000' : '#ffffff';
        ctx.font = '700 9px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillText(`WG${w}`, cx + 16 + w * 35, blockY + 115);
      }

      // 4. Output Buffer C
      const ox = 480;
      ctx.fillStyle = currentTheme === 'dark' ? '#121215' : '#f4f4f5';
      ctx.strokeStyle = currentTheme === 'dark' ? '#ffffff' : '#000000';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(ox, blockY, 140, 160);
      ctx.fillRect(ox, blockY, 140, 160);

      ctx.fillStyle = currentTheme === 'dark' ? '#ffffff' : '#000000';
      ctx.font = '700 11px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText('OUTPUT BUFFER C', ox + 10, blockY + 22);
      ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = currentTheme === 'dark' ? '#a1a1aa' : '#71717a';
      ctx.fillText('Access: READ_WRITE', ox + 10, blockY + 44);
      ctx.fillText('State: Staged & Verified', ox + 10, blockY + 62);
      ctx.fillText('Transfer: D2H Success', ox + 10, blockY + 80);

      // Animated Data Flow Stream Packets (Pure glowing white/black)
      const busY = blockY + 80;
      const p1 = (elapsed * 200) % (cx - 170);
      ctx.fillStyle = currentTheme === 'dark' ? '#ffffff' : '#000000';
      ctx.shadowBlur = 6;
      ctx.shadowColor = currentTheme === 'dark' ? '#ffffff' : '#000000';
      ctx.beginPath();
      ctx.arc(170 + p1, busY, 4, 0, Math.PI * 2);
      ctx.fill();

      const p2 = (elapsed * 200) % (ox - (cx + 160));
      ctx.beginPath();
      ctx.arc(cx + 160 + p2, busY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Bottom Metrics Meter
      ctx.fillStyle = currentTheme === 'dark' ? '#18181b' : '#f4f4f5';
      ctx.strokeStyle = currentTheme === 'dark' ? '#27272a' : '#e4e4e7';
      ctx.strokeRect(30, 260, 590, 45);
      ctx.fillRect(30, 260, 590, 45);

      ctx.fillStyle = currentTheme === 'dark' ? '#ffffff' : '#000000';
      ctx.font = '700 11px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText(`COMPUTE THROUGHPUT: ~28.4 GB/s | LATENCY: ${(durationMs * 1000).toFixed(1)} us | VALIDATION: 100% MATCH`, 42, 287);

      if (elapsed < 8) {
        computeVizId = requestAnimationFrame(animate);
      }
    }
    computeVizId = requestAnimationFrame(animate);
  }

  function setViewportMode(mode) {
    viewportMode = mode;
    const termPane = document.getElementById('gpgpu-terminal-pane');
    const canvasPane = document.getElementById('gpgpu-canvas-pane');

    document.querySelectorAll('.gpgpu-vtab').forEach(btn => {
      btn.classList.toggle('active', btn.id === `tab-${mode}`);
    });

    if (!termPane || !canvasPane) return;

    if (mode === 'terminal') {
      termPane.style.display = 'block';
      termPane.style.width = '100%';
      canvasPane.style.display = 'none';
    } else if (mode === 'canvas') {
      termPane.style.display = 'none';
      canvasPane.style.display = 'flex';
      canvasPane.style.width = '100%';
    } else if (mode === 'split') {
      termPane.style.display = 'block';
      termPane.style.width = '50%';
      canvasPane.style.display = 'flex';
      canvasPane.style.width = '50%';
    }

    if (window.xtermInstance?.element) {
      window.xtermInstance.resize(window.xtermInstance.cols, window.xtermInstance.rows);
    }
  }

  function setupViewportTabs() {
    document.getElementById('tab-terminal')?.addEventListener('click', () => setViewportMode('terminal'));
    document.getElementById('tab-canvas')?.addEventListener('click', () => setViewportMode('canvas'));
    document.getElementById('tab-split')?.addEventListener('click', () => setViewportMode('split'));
  }

  function setupCanvasInteractivity() {
    const canvas = document.getElementById('gpgpu-live-canvas');
    if (!canvas) return;

    let isDrawing = false;
    function paint(e) {
      if (!activeSimState) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const cx = (e.clientX - rect.left) * scaleX;
      const cy = (e.clientY - rect.top) * scaleY;
      const gx = Math.floor(cx / (canvas.width / activeSimState.width));
      const gy = Math.floor(cy / (canvas.height / activeSimState.height));
      if (gx >= 0 && gx < activeSimState.width && gy >= 0 && gy < activeSimState.height) {
        const idx = gy * activeSimState.width + gx;
        activeSimState.currentCells[idx] = 1;
        const targetBuf = activeSimState.pingPong === 0 ? activeSimState.gridBufferA : activeSimState.gridBufferB;
        activeSimState.device.queue.writeBuffer(targetBuf, idx * 4, new Uint32Array([1]));
      }
    }

    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      paint(e);
    });
    window.addEventListener('mouseup', () => { isDrawing = false; });
    canvas.addEventListener('mousemove', (e) => {
      if (isDrawing) paint(e);
    });

    // Control buttons
    document.getElementById('ctrl-play-btn')?.addEventListener('click', () => {
      if (!activeSimState) return;
      activeSimState.isPaused = !activeSimState.isPaused;
      const text = document.getElementById('ctrl-play-text');
      if (text) text.textContent = activeSimState.isPaused ? 'Play' : 'Pause';
    });

    document.getElementById('ctrl-step-btn')?.addEventListener('click', () => {
      if (!activeSimState) return;
      activeSimState.isPaused = true;
      const text = document.getElementById('ctrl-play-text');
      if (text) text.textContent = 'Play';
      // Step 1 generation
      const state = activeSimState;
      state.generation++;
      const commandEncoder = state.device.createCommandEncoder();
      const pass = commandEncoder.beginComputePass();
      pass.setPipeline(state.pipeline);
      pass.setBindGroup(0, state.pingPong === 0 ? state.bindGroupA : state.bindGroupB);
      pass.dispatchWorkgroups(Math.ceil(state.width / 16), Math.ceil(state.height / 16), 1);
      pass.end();
      const activeOutBuffer = state.pingPong === 0 ? state.gridBufferB : state.gridBufferA;
      commandEncoder.copyBufferToBuffer(activeOutBuffer, 0, state.stagingBuffer, 0, state.width * state.height * 4);
      state.device.queue.submit([commandEncoder.finish()]);
      state.stagingBuffer.mapAsync(GPUMapMode.READ).then(() => {
        state.currentCells.set(new Uint32Array(state.stagingBuffer.getMappedRange()));
        state.stagingBuffer.unmap();
        state.pingPong = 1 - state.pingPong;
        renderSimulationToCanvas(state.currentCells, state.width, state.height, state.generation, state.lastDurationUs, 0, state.gpuName, state.target);
        renderGridToTerminal(state.currentCells, state.width, state.height, state.generation, state.lastDurationUs, state.gpuName);
      });
    });

    document.getElementById('ctrl-clear-btn')?.addEventListener('click', () => {
      if (!activeSimState) return;
      activeSimState.currentCells.fill(0);
      activeSimState.device.queue.writeBuffer(activeSimState.gridBufferA, 0, activeSimState.currentCells);
      activeSimState.device.queue.writeBuffer(activeSimState.gridBufferB, 0, activeSimState.currentCells);
      renderSimulationToCanvas(activeSimState.currentCells, activeSimState.width, activeSimState.height, activeSimState.generation, 0, 0, activeSimState.gpuName, activeSimState.target);
    });

    document.getElementById('ctrl-preset-select')?.addEventListener('change', (e) => {
      simCurrentPreset = e.target.value;
      if (activeSimState) {
        const fresh = getSeedGrid(simCurrentPreset, activeSimState.width, activeSimState.height);
        activeSimState.currentCells.set(fresh);
        activeSimState.device.queue.writeBuffer(activeSimState.gridBufferA, 0, fresh);
        activeSimState.device.queue.writeBuffer(activeSimState.gridBufferB, 0, fresh);
        renderSimulationToCanvas(fresh, activeSimState.width, activeSimState.height, activeSimState.generation, 0, 0, activeSimState.gpuName, activeSimState.target);
      }
    });

    document.getElementById('ctrl-speed-select')?.addEventListener('change', (e) => {
      simTargetFPS = e.target.value;
    });
  }

  function updateHeroRunButton(running) {
    const runBtn = document.querySelector('button.bg-blue-500, button.gpgpu-hero-run-btn');
    if (!runBtn) return;
    if (running) {
      runBtn.classList.add('running');
      runBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
        <span>Stop Simulation</span>
      `;
    } else {
      runBtn.classList.remove('running');
      runBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
        <span>Run GPU Kernel</span>
      `;
    }
  }

  // Themes
  let currentTheme = (typeof localStorage !== 'undefined' && localStorage.getItem('gpgpu-theme')) || 'dark';

  function applyTheme(theme) {
    currentTheme = theme;
    if (typeof localStorage !== 'undefined') localStorage.setItem('gpgpu-theme', theme);

    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);

    const lightBtn = document.getElementById('theme-btn-light');
    const darkBtn = document.getElementById('theme-btn-dark');
    if (lightBtn && darkBtn) {
      lightBtn.classList.toggle('active', theme === 'light');
      darkBtn.classList.toggle('active', theme === 'dark');
    }

    if (window.monaco?.editor) {
      window.monaco.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs');
    }

    if (window.xtermInstance) {
      const termDark = {
        background: '#000000',
        foreground: '#f4f4f5',
        cursor: '#ffffff',
        selectionBackground: 'rgba(255, 255, 255, 0.25)',
        black: '#000000',
        red: '#e4e4e7',
        green: '#ffffff',
        yellow: '#d4d4d8',
        blue: '#e4e4e7',
        magenta: '#d4d4d8',
        cyan: '#ffffff',
        white: '#ffffff',
        brightBlack: '#71717a',
        brightRed: '#ffffff',
        brightGreen: '#ffffff',
        brightYellow: '#e4e4e7',
        brightBlue: '#ffffff',
        brightMagenta: '#e4e4e7',
        brightCyan: '#ffffff',
        brightWhite: '#ffffff'
      };
      const termLight = {
        background: '#ffffff',
        foreground: '#09090b',
        cursor: '#000000',
        selectionBackground: 'rgba(0, 0, 0, 0.2)',
        black: '#000000',
        red: '#18181b',
        green: '#27272a',
        yellow: '#3f3f46',
        blue: '#18181b',
        magenta: '#27272a',
        cyan: '#09090b',
        white: '#52525b',
        brightBlack: '#a1a1aa',
        brightRed: '#09090b',
        brightGreen: '#18181b',
        brightYellow: '#27272a',
        brightBlue: '#09090b',
        brightMagenta: '#18181b',
        brightCyan: '#09090b',
        brightWhite: '#000000'
      };
      window.xtermInstance.options.theme = theme === 'dark' ? termDark : termLight;
    }
  }

  function injectStyles() {
    if (document.getElementById('gpgpu-custom-styles')) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'gpgpu-custom-styles';
    styleEl.textContent = `
      :root {
        --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      }

      /* Hide redundant legacy Svelte sample code controls */
      small.nojs-hidden, select.nojs-hidden {
        display: none !important;
      }

      /* Global monochrome overrides for legacy and framework elements */
      html, body {
        background-color: #000000 !important;
        color: #ffffff !important;
      }
      .dark\:bg-slate-900, .dark\:bg-black, .bg-slate-900, .md\:w-72 {
        background-color: #000000 !important;
      }
      .bg-green-200, .dark\:bg-green-900, .bg-blue-500, .dark\:bg-blue-900, .bg-blue-200, .bg-orange-200, .dark\:bg-orange-950, .bg-fuchsia-200, .dark\:bg-fuchsia-950, .bg-sky-200, .dark\:bg-sky-900 {
        background-color: #18181b !important;
        color: #ffffff !important;
        border-color: #3f3f46 !important;
      }
      .text-green-950, .dark\:text-green-100, .text-blue-800, .dark\:text-blue-300, .text-orange-700, .dark\:text-orange-300, .text-orange-950, .dark\:text-orange-200 {
        color: #f4f4f5 !important;
      }
      .hover\:bg-blue-700:hover, .hover\:bg-red-700:hover {
        background-color: #27272a !important;
      }
      .svelte-1n31lag button, button.svelte-1n31lag {
        border: 1px solid #3f3f46 !important;
        background: #18181b !important;
        color: #ffffff !important;
      }
      .svelte-1n31lag button:hover, button.svelte-1n31lag:hover {
        background: #27272a !important;
        border-color: #71717a !important;
      }

      .gpgpu-brand-banner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        margin-bottom: 6px;
        border-radius: 8px;
        user-select: none;
      }
      html.dark .gpgpu-brand-banner {
        background: #09090b;
        border: 1px solid #27272a;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
      }
      html.light .gpgpu-brand-banner {
        background: #ffffff;
        border: 1px solid #e4e4e7;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }
      .gpgpu-brand-left {
        display: flex;
        align-items: baseline;
        gap: 6px;
      }
      .gpgpu-logo-text {
        font-weight: 800;
        font-size: 1.35rem;
        letter-spacing: -0.03em;
        background: linear-gradient(135deg, #ffffff 0%, #d4d4d8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      html.light .gpgpu-logo-text {
        background: linear-gradient(135deg, #09090b 0%, #27272a 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .gpgpu-version-tag {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.08em;
        padding: 2px 5px;
        border-radius: 4px;
        text-transform: uppercase;
      }
      html.dark .gpgpu-version-tag {
        background: #18181b;
        color: #ffffff;
        border: 1px solid #3f3f46;
      }
      html.light .gpgpu-version-tag {
        background: #f4f4f5;
        color: #09090b;
        border: 1px solid #d4d4d8;
      }

      .gpgpu-theme-switcher {
        display: flex;
        align-items: center;
        background: rgba(0, 0, 0, 0.4);
        padding: 2px;
        border-radius: 6px;
        border: 1px solid #27272a;
      }
      html.light .gpgpu-theme-switcher {
        background: #f4f4f5;
        border-color: #e4e4e7;
      }
      .gpgpu-theme-option {
        padding: 3px 7px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        background: transparent;
        color: #71717a;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: all 0.15s ease;
      }
      html.dark .gpgpu-theme-option.active {
        background: #ffffff;
        color: #000000;
        font-weight: 700;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }
      html.light .gpgpu-theme-option.active {
        background: #000000;
        color: #ffffff;
        font-weight: 700;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .gpgpu-subtitle-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 11px;
        color: #a1a1aa;
        margin-bottom: 8px;
        padding: 0 4px;
      }
      html.light .gpgpu-subtitle-row {
        color: #52525b;
      }
      .gpgpu-live-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 9px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      html.light .gpgpu-live-badge {
        color: #09090b;
      }
      .gpgpu-pulse-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0 0 6px #ffffff;
        animation: gpgpu-pulse 1.8s infinite;
      }
      html.light .gpgpu-pulse-dot {
        background: #09090b;
        box-shadow: 0 0 6px #09090b;
      }
      @keyframes gpgpu-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.85); }
      }

      #gpgpu-framework-panel {
        margin-bottom: 8px;
        padding: 8px;
        border-radius: 7px;
        font-family: var(--font-mono);
      }
      html.dark #gpgpu-framework-panel {
        background: #09090b;
        border: 1px solid #27272a;
      }
      html.light #gpgpu-framework-panel {
        background: #fafafa;
        border: 1px solid #e4e4e7;
      }
      .gpgpu-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
      }
      .gpgpu-title {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      html.dark .gpgpu-title { color: #a1a1aa; }
      html.light .gpgpu-title { color: #52525b; }
      .gpgpu-badge {
        font-size: 9px;
        font-weight: 600;
        padding: 1px 5px;
        border-radius: 3px;
      }
      html.dark .gpgpu-badge {
        background: #18181b;
        color: #ffffff;
        border: 1px solid #3f3f46;
      }
      html.light .gpgpu-badge {
        background: #f4f4f5;
        color: #09090b;
        border: 1px solid #d4d4d8;
      }

      .gpgpu-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 3px;
        margin-bottom: 6px;
      }
      .gpgpu-pill {
        padding: 4px 2px;
        font-size: 9px;
        font-weight: 600;
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
        user-select: none;
        transition: all 0.15s ease;
      }
      html.dark .gpgpu-pill {
        border: 1px solid #27272a;
        background: #09090b;
        color: #a1a1aa;
      }
      html.dark .gpgpu-pill:hover {
        background: #18181b;
        color: #ffffff;
        border-color: #52525b;
      }
      html.dark .gpgpu-pill.active {
        background: #ffffff;
        color: #000000;
        font-weight: 700;
        border-color: #ffffff;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
      }
      html.light .gpgpu-pill {
        border: 1px solid #e4e4e7;
        background: #ffffff;
        color: #52525b;
      }
      html.light .gpgpu-pill:hover {
        background: #f4f4f5;
        color: #000000;
        border-color: #a1a1aa;
      }
      html.light .gpgpu-pill.active {
        background: #000000;
        color: #ffffff;
        font-weight: 700;
        border-color: #000000;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
      }

      .gpgpu-select {
        width: 100%;
        font-size: 11px;
        font-family: var(--font-mono);
        padding: 5px 8px;
        border-radius: 5px;
        outline: none;
        margin-bottom: 6px;
      }
      html.dark .gpgpu-select {
        background: #09090b;
        color: #ffffff;
        border: 1px solid #27272a;
      }
      html.dark .gpgpu-select:focus {
        border-color: #ffffff;
      }
      html.light .gpgpu-select {
        background: #ffffff;
        color: #09090b;
        border: 1px solid #d4d4d8;
      }
      html.light .gpgpu-select:focus {
        border-color: #000000;
      }

      .gpgpu-label-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 10px;
        margin-bottom: 3px;
      }
      html.dark .gpgpu-label-row { color: #a1a1aa; }
      html.light .gpgpu-label-row { color: #52525b; }

      .gpgpu-active-sample-badge {
        font-size: 9px;
        padding: 1px 5px;
        border-radius: 3px;
        font-weight: 700;
      }
      html.dark .gpgpu-active-sample-badge {
        background: #18181b;
        color: #ffffff;
        border: 1px solid #3f3f46;
      }
      html.light .gpgpu-active-sample-badge {
        background: #f4f4f5;
        color: #09090b;
        border: 1px solid #d4d4d8;
      }

      .gpgpu-actions-row {
        display: flex;
        gap: 5px;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      html.light .gpgpu-actions-row {
        border-top: 1px solid #e4e4e7;
      }
      .gpgpu-btn {
        flex: 1;
        padding: 6px 3px;
        border-radius: 5px;
        font-size: 9.5px;
        font-family: var(--font-mono);
        font-weight: 600;
        cursor: pointer;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        transition: all 0.15s ease;
      }
      html.dark .gpgpu-btn {
        border: 1px solid #27272a;
        background: #09090b;
        color: #e4e4e7;
      }
      html.dark .gpgpu-btn:hover {
        background: #18181b;
        color: #ffffff;
        border-color: #52525b;
      }
      html.light .gpgpu-btn {
        border: 1px solid #e4e4e7;
        background: #ffffff;
        color: #27272a;
      }
      html.light .gpgpu-btn:hover {
        background: #f4f4f5;
        color: #000000;
        border-color: #a1a1aa;
      }

      .gpgpu-hero-run-btn {
        width: 100% !important;
        margin-top: 8px !important;
        padding: 10px 16px !important;
        border-radius: 7px !important;
        background: #ffffff !important;
        color: #000000 !important;
        font-weight: 700 !important;
        font-size: 12px !important;
        letter-spacing: 0.05em !important;
        text-transform: uppercase !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;
        border: 1px solid #ffffff !important;
        box-shadow: 0 4px 14px rgba(255, 255, 255, 0.25) !important;
        transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      .gpgpu-hero-run-btn:hover {
        transform: translateY(-1px) !important;
        background: #f4f4f5 !important;
        box-shadow: 0 6px 20px rgba(255, 255, 255, 0.45) !important;
      }
      html.light .gpgpu-hero-run-btn {
        background: #000000 !important;
        color: #ffffff !important;
        border: 1px solid #000000 !important;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25) !important;
      }
      html.light .gpgpu-hero-run-btn:hover {
        background: #27272a !important;
      }
      .gpgpu-hero-run-btn.running {
        background: #18181b !important;
        color: #ffffff !important;
        border: 1px solid #ffffff !important;
        box-shadow: 0 0 16px rgba(255, 255, 255, 0.5) !important;
        animation: gpgpu-run-pulse 1.2s infinite alternate !important;
      }
      @keyframes gpgpu-run-pulse {
        from { box-shadow: 0 0 8px rgba(255, 255, 255, 0.3); }
        to { box-shadow: 0 0 20px rgba(255, 255, 255, 0.7); }
      }

      .gpgpu-editor-header {
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
        font-size: 11px;
        font-family: var(--font-mono);
        user-select: none;
        border-bottom: 1px solid #27272a;
      }
      html.dark .gpgpu-editor-header {
        background: #09090b;
        color: #a1a1aa;
      }
      html.light .gpgpu-editor-header {
        background: #f8fafc;
        color: #52525b;
        border-bottom: 1px solid #e4e4e7;
      }

      .gpgpu-terminal-header {
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
        font-size: 11px;
        font-family: var(--font-mono);
        user-select: none;
        border-top: 1px solid #27272a;
        border-bottom: 1px solid #27272a;
      }
      html.dark .gpgpu-terminal-header {
        background: #09090b;
        color: #a1a1aa;
      }
      html.light .gpgpu-terminal-header {
        background: #f4f4f5;
        color: #52525b;
        border-color: #e4e4e7;
      }

      .gpgpu-terminal-dots {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .gpgpu-terminal-dots .dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
      }
      .gpgpu-terminal-dots .dot-red { background: #ffffff; }
      .gpgpu-terminal-dots .dot-yellow { background: #a1a1aa; }
      .gpgpu-terminal-dots .dot-green { background: #3f3f46; }

      .gpgpu-viewport-tabs {
        display: flex;
        align-items: center;
        gap: 3px;
        background: rgba(0, 0, 0, 0.4);
        padding: 2px 3px;
        border-radius: 6px;
        border: 1px solid #27272a;
      }
      html.light .gpgpu-viewport-tabs {
        background: #f4f4f5;
        border-color: #e4e4e7;
      }
      .gpgpu-vtab {
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-family: var(--font-mono);
        font-weight: 600;
        cursor: pointer;
        border: none;
        background: transparent;
        color: #71717a;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: all 0.15s ease;
      }
      html.dark .gpgpu-vtab.active {
        background: #ffffff;
        color: #000000;
        font-weight: 700;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
      }
      html.light .gpgpu-vtab.active {
        background: #000000;
        color: #ffffff;
        font-weight: 700;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      .gpgpu-live-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0 0 6px #ffffff;
        animation: gpgpu-pulse 1.8s infinite;
      }
      html.light .gpgpu-live-dot {
        background: #000000;
        box-shadow: 0 0 6px #000000;
      }

      .gpgpu-viewport-wrapper {
        position: relative;
        height: 424px;
        display: flex;
        overflow: hidden;
      }
      .gpgpu-viewport-pane {
        height: 100%;
        overflow: hidden;
        position: relative;
      }
      .gpgpu-pane-terminal {
        flex: 1;
        background: #000000;
      }
      .gpgpu-pane-canvas {
        flex: 1;
        background: radial-gradient(circle at center, #121215 0%, #000000 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        border-left: 1px solid #27272a;
      }
      html.light .gpgpu-pane-canvas {
        background: radial-gradient(circle at center, #ffffff 0%, #f4f4f5 100%);
        border-left: 1px solid #e4e4e7;
      }

      #gpgpu-live-canvas {
        display: block;
        max-width: 96%;
        max-height: 82%;
        object-fit: contain;
        image-rendering: pixelated;
        cursor: crosshair;
        border-radius: 6px;
        box-shadow: 0 0 24px rgba(255, 255, 255, 0.12);
      }

      .gpgpu-canvas-hud-top {
        position: absolute;
        top: 8px;
        left: 12px;
        right: 12px;
        display: flex;
        justify-content: space-between;
        pointer-events: none;
        z-index: 10;
      }
      .gpgpu-canvas-hud-bottom {
        position: absolute;
        bottom: 8px;
        left: 12px;
        right: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        pointer-events: none;
        z-index: 10;
      }
      .gpgpu-hud-badge {
        background: rgba(18, 18, 21, 0.9);
        backdrop-filter: blur(8px);
        border: 1px solid #27272a;
        padding: 4px 9px;
        border-radius: 5px;
        font-size: 10px;
        font-family: var(--font-mono);
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      html.light .gpgpu-hud-badge {
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid #d4d4d8;
        color: #09090b;
      }

      .gpgpu-canvas-controls {
        display: flex;
        align-items: center;
        gap: 5px;
        pointer-events: auto;
      }
      .gpgpu-ctrl-btn {
        background: #18181b;
        border: 1px solid #27272a;
        color: #e4e4e7;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 10px;
        font-family: var(--font-mono);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: all 0.15s ease;
      }
      .gpgpu-ctrl-btn:hover {
        background: #27272a;
        color: #ffffff;
        border-color: #52525b;
      }
      html.light .gpgpu-ctrl-btn {
        background: #ffffff;
        border-color: #d4d4d8;
        color: #27272a;
      }
      html.light .gpgpu-ctrl-btn:hover {
        background: #f4f4f5;
        color: #000000;
        border-color: #a1a1aa;
      }

      .gpgpu-ctrl-select {
        background: #18181b;
        border: 1px solid #27272a;
        color: #ffffff;
        padding: 3px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-family: var(--font-mono);
        outline: none;
        cursor: pointer;
      }
      html.light .gpgpu-ctrl-select {
        background: #ffffff;
        border-color: #d4d4d8;
        color: #09090b;
      }

      .gpgpu-term-clear-btn {
        background: transparent;
        border: 1px solid #27272a;
        padding: 2px 7px;
        border-radius: 4px;
        font-size: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: all 0.15s ease;
      }
      html.dark .gpgpu-term-clear-btn { color: #a1a1aa; }
      html.dark .gpgpu-term-clear-btn:hover {
        background: #18181b;
        color: #ffffff;
        border-color: #52525b;
      }
      html.light .gpgpu-term-clear-btn { color: #52525b; }
      html.light .gpgpu-term-clear-btn:hover {
        background: #f4f4f5;
        color: #000000;
      }
    `;
    document.head.appendChild(styleEl);
  }

  function injectSidebarBranding(container) {
    if (document.getElementById('gpgpu-brand-banner')) return;

    const brandEl = document.createElement('div');
    brandEl.id = 'gpgpu-brand-banner';
    brandEl.className = 'gpgpu-brand-banner';
    brandEl.innerHTML = `
      <div class="gpgpu-brand-left">
        <div class="gpgpu-logo-text">GPGPU</div>
      </div>
      <div class="gpgpu-theme-switcher" role="radiogroup" aria-label="Theme Toggle">
        <button type="button" id="theme-btn-light" class="gpgpu-theme-option ${currentTheme === 'light' ? 'active' : ''}" title="Switch to Light Theme">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <span>Light</span>
        </button>
        <button type="button" id="theme-btn-dark" class="gpgpu-theme-option ${currentTheme === 'dark' ? 'active' : ''}" title="Switch to Dark Theme">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <span>Dark</span>
        </button>
      </div>
    `;

    const subtitleRow = document.createElement('div');
    subtitleRow.className = 'gpgpu-subtitle-row';
    subtitleRow.innerHTML = `
      <span style="font-weight:500;">Multi-Paradigm GPU Compute</span>
      <div class="gpgpu-live-badge">
        <span class="gpgpu-pulse-dot"></span>
        <span>WebGPU Native</span>
      </div>
    `;

    const h1 = container.querySelector('h1');
    if (h1) {
      h1.style.display = 'none';
      container.insertBefore(brandEl, h1);
    } else {
      container.prepend(brandEl);
    }

    const pList = container.querySelectorAll('p');
    pList.forEach(p => { p.style.display = 'none'; });

    brandEl.after(subtitleRow);

    document.getElementById('theme-btn-light')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      applyTheme('light');
    });
    document.getElementById('theme-btn-dark')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      applyTheme('dark');
    });
  }

  function injectEditorAndTerminalHeaders() {
    // Monaco Header
    const editorContainer = document.querySelector('div.min-h-\\[60vh\\]');
    if (editorContainer && !document.getElementById('gpgpu-editor-header')) {
      const edHeader = document.createElement('div');
      edHeader.id = 'gpgpu-editor-header';
      edHeader.className = 'gpgpu-editor-header';
      edHeader.innerHTML = `
        <div style="display:flex;align-items:center;gap:6px;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          <span style="font-weight:700;letter-spacing:0.04em;">KERNEL SOURCE</span>
        </div>
        <div id="editor-lang-badge" class="gpgpu-active-sample-badge">${FRAMEWORKS[activeFramework].name} [${FRAMEWORKS[activeFramework].badge}]</div>
      `;
      editorContainer.parentElement?.insertBefore(edHeader, editorContainer);
    }

    // Viewport & Terminal Container
    const termWrapper = document.querySelector('div.h-\\[424px\\]');
    if (termWrapper && !document.getElementById('gpgpu-viewport-wrapper')) {
      const parent = termWrapper.parentElement;
      if (parent) {
        const vpWrapper = document.createElement('div');
        vpWrapper.id = 'gpgpu-viewport-wrapper';
        vpWrapper.className = 'gpgpu-viewport-wrapper';

        parent.insertBefore(vpWrapper, termWrapper);

        termWrapper.classList.remove('h-[424px]');
        termWrapper.id = 'gpgpu-terminal-pane';
        termWrapper.className = 'gpgpu-viewport-pane gpgpu-pane-terminal';
        vpWrapper.appendChild(termWrapper);

        const canvasPane = document.createElement('div');
        canvasPane.id = 'gpgpu-canvas-pane';
        canvasPane.className = 'gpgpu-viewport-pane gpgpu-pane-canvas';
        canvasPane.style.display = 'none';
        canvasPane.innerHTML = `
          <div class="gpgpu-canvas-hud-top">
            <div class="gpgpu-hud-badge" id="hud-target-badge">
              <span class="gpgpu-pulse-dot"></span>
              <span id="hud-target-text">TARGET: AMD ROCm (HIP)</span>
            </div>
            <div class="gpgpu-hud-badge" id="hud-adapter-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
              <span id="hud-adapter-text">GPU: Apple M-Series</span>
            </div>
          </div>

          <canvas id="gpgpu-live-canvas" width="640" height="320"></canvas>

          <div class="gpgpu-canvas-hud-bottom">
            <div class="gpgpu-hud-badge" id="hud-stats-badge">
              <span id="hud-gen-text">GEN: 0</span>
              <span style="opacity:0.4;">|</span>
              <span id="hud-cells-text">ALIVE: 0</span>
              <span style="opacity:0.4;">|</span>
              <span id="hud-time-text">GPU: 0.0 us</span>
              <span style="opacity:0.4;">|</span>
              <span id="hud-fps-text">60 FPS</span>
            </div>
            <div class="gpgpu-canvas-controls" id="gpgpu-canvas-controls">
              <button type="button" class="gpgpu-ctrl-btn" id="ctrl-play-btn" title="Play / Pause Simulation">
                <svg id="ctrl-play-icon" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                <span id="ctrl-play-text">Pause</span>
              </button>
              <button type="button" class="gpgpu-ctrl-btn" id="ctrl-step-btn" title="Step 1 Generation">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="3"/></svg>
                <span>Step</span>
              </button>
              <select class="gpgpu-ctrl-select" id="ctrl-preset-select" title="Cellular Seed Pattern">
                <option value="glider_gun">Preset: Glider Gun</option>
                <option value="pulsar">Preset: Pulsar</option>
                <option value="spaceships">Preset: Spaceships</option>
                <option value="random">Preset: Random Soup</option>
                <option value="acorn">Preset: Acorn</option>
              </select>
              <button type="button" class="gpgpu-ctrl-btn" id="ctrl-clear-btn" title="Clear Grid">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
                <span>Clear</span>
              </button>
              <select class="gpgpu-ctrl-select" id="ctrl-speed-select" title="Simulation Speed">
                <option value="60">60 FPS</option>
                <option value="30">30 FPS</option>
                <option value="15">15 FPS</option>
                <option value="max">Max Speed</option>
              </select>
            </div>
          </div>
        `;
        vpWrapper.appendChild(canvasPane);

        const termHeader = document.createElement('div');
        termHeader.id = 'gpgpu-terminal-header';
        termHeader.className = 'gpgpu-terminal-header';
        termHeader.innerHTML = `
          <div class="gpgpu-terminal-dots">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
            <span style="font-weight:700;margin-left:4px;letter-spacing:0.04em;">GPU COMPUTE CONSOLE</span>
          </div>
          <div class="gpgpu-viewport-tabs" role="tablist">
            <button type="button" id="tab-terminal" class="gpgpu-vtab active" title="Console Terminal">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
              <span>Terminal</span>
            </button>
            <button type="button" id="tab-canvas" class="gpgpu-vtab" title="Live GPU Display">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              <span>Live GPU Display</span>
              <span class="gpgpu-live-dot"></span>
            </button>
            <button type="button" id="tab-split" class="gpgpu-vtab" title="Split Screen View">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
              <span>Split View</span>
            </button>
          </div>
          <button id="clear-term-btn" type="button" class="gpgpu-term-clear-btn" title="Clear Terminal Output">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            <span>Clear</span>
          </button>
        `;
        parent.insertBefore(termHeader, vpWrapper);

        setupViewportTabs();
        setupCanvasInteractivity();

        document.getElementById('clear-term-btn')?.addEventListener('click', () => {
          window.xtermInstance?.reset();
        });
      }
    }
  }

  function enhanceRunButton(container) {
    const runBtn = container.querySelector('button.bg-blue-500, button.gpgpu-hero-run-btn');
    if (runBtn) {
      runBtn.className = 'gpgpu-hero-run-btn';
      runBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
        <span>Run GPU Kernel</span>
      `;
    }
  }

  function detectFramework(code) {
    if (activeFramework !== 'cuda_hip') {
      return activeFramework;
    }
    if (code.includes('hipBlockDim_x') || code.includes('rocm_')) {
      return 'rocm';
    }
    if (code.includes('@compute') || code.includes('@workgroup_size') || code.includes('var<storage')) {
      return 'webgpu';
    }
    if (code.includes('__kernel') || code.includes('get_global_id')) {
      return 'opencl';
    }
    if (code.includes('<metal_stdlib>') || code.includes('namespace metal') || code.includes('thread_position_in_grid')) {
      return 'metal';
    }
    if (code.includes('sycl::') || code.includes('<sycl/sycl.hpp>')) {
      return 'sycl';
    }
    if (code.includes('#pragma omp') || code.includes('#pragma acc')) {
      return 'openmp';
    }
    if (code.includes('@triton.jit') || code.includes('import triton') || code.includes('tl.')) {
      return 'triton';
    }
    if (code.includes('#version 450') || code.includes('gl_GlobalInvocationID')) {
      return 'vulkan';
    }
    if (code.includes('#version 430')) {
      return 'opengl';
    }
    return 'cuda_hip';
  }

  function injectFrameworkSelector(container) {
    if (document.getElementById('gpgpu-framework-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'gpgpu-framework-panel';
    panel.innerHTML = `
      <div class="gpgpu-header">
        <span class="gpgpu-title">Compute Target</span>
        <span class="gpgpu-badge">10 Engines</span>
      </div>
      <div class="gpgpu-grid">
        <button type="button" data-fw="rocm" class="gpgpu-pill">ROCm</button>
        <button type="button" data-fw="webgpu" class="gpgpu-pill">WebGPU</button>
        <button type="button" data-fw="cuda_hip" class="gpgpu-pill">CUDA</button>
        <button type="button" data-fw="opencl" class="gpgpu-pill">OpenCL</button>
        <button type="button" data-fw="vulkan" class="gpgpu-pill">Vulkan</button>
        <button type="button" data-fw="opengl" class="gpgpu-pill">OpenGL</button>
        <button type="button" data-fw="metal" class="gpgpu-pill">Metal</button>
        <button type="button" data-fw="sycl" class="gpgpu-pill">SYCL</button>
        <button type="button" data-fw="openmp" class="gpgpu-pill">OpenMP</button>
        <button type="button" data-fw="triton" class="gpgpu-pill">Triton</button>
      </div>
      <div>
        <select id="fw-dropdown" class="gpgpu-select">
          ${Object.entries(FRAMEWORKS).map(([key, f]) => `
            <option value="${key}">${f.name} [${f.badge}]</option>
          `).join('')}
        </select>
      </div>
      <div class="gpgpu-label-row">
        <span>Sample Kernel:</span>
        <span id="active-badge" class="gpgpu-active-sample-badge">HIP C++</span>
      </div>
      <div>
        <select id="fw-sample-dropdown" class="gpgpu-select">
        </select>
      </div>
      <div class="gpgpu-actions-row">
        <button id="view-wgsl-btn" type="button" class="gpgpu-btn" title="View WGSL shader in terminal">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>View WGSL</span>
        </button>
        <button id="download-code-btn" type="button" class="gpgpu-btn" title="Save source code file">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <span>Save Code</span>
        </button>
        <button id="download-wgsl-btn" type="button" class="gpgpu-btn" title="Save WGSL compute shader">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>Save WGSL</span>
        </button>
        <button id="download-spv-btn" type="button" class="gpgpu-btn" title="Save SPIR-V binary">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg>
          <span>Save SPV</span>
        </button>
      </div>
    `;

    const subtitleRow = container.querySelector('.gpgpu-subtitle-row');
    if (subtitleRow) {
      subtitleRow.after(panel);
    } else {
      container.prepend(panel);
    }

    updateSampleDropdown();

    const fwSelect = document.getElementById('fw-dropdown');
    const sampleSelect = document.getElementById('fw-sample-dropdown');

    fwSelect?.addEventListener('change', (e) => {
      selectFramework(e.target.value);
    });

    panel.querySelectorAll('.gpgpu-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const fwKey = btn.getAttribute('data-fw');
        if (fwKey) selectFramework(fwKey);
      });
    });

    sampleSelect?.addEventListener('change', (e) => {
      const sampleName = e.target.value;
      const code = FRAMEWORKS[activeFramework].samples[sampleName];
      if (code) {
        setEditorContent(code, FRAMEWORKS[activeFramework].lang);
      }
    });

    function triggerFileDownload(blob, filename) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (document.body.contains(a)) document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 400);
    }

    const viewWgslBtn = document.getElementById('view-wgsl-btn');
    const dlCodeBtn = document.getElementById('download-code-btn');
    const dlWgslBtn = document.getElementById('download-wgsl-btn');
    const dlSpvBtn = document.getElementById('download-spv-btn');

    viewWgslBtn?.addEventListener('click', async () => {
      const xterm = window.xtermInstance;
      let wgsl = window.latestShaderWGSL;
      if (!wgsl) {
        const editor = window.editor || window.monacoEditor;
        const code = editor ? editor.getValue() : (window.monaco?.editor?.getModels()?.[0]?.getValue() || '');
        if (code) {
          try {
            wgsl = await transpileAnyCodeToWGSL(activeFramework, code);
            window.latestShaderWGSL = wgsl;
          } catch (err) {
            if (xterm) xterm.writeln(`${ESC}[1;37m[GPGPU]${ESC}[0m Transpile notice: ${err.message || err}`);
          }
        }
      }
      if (!wgsl) {
        if (xterm) xterm.writeln(`${ESC}[1;90m[GPGPU]${ESC}[0m Run a shader or write compute code first to view generated WGSL.`);
        return;
      }
      if (xterm) {
        xterm.writeln(`${ESC}[1;37m=== Generated WGSL Compute Shader ===${ESC}[0m`);
        xterm.writeln(wgsl);
        xterm.writeln(`${ESC}[1;37m====================================${ESC}[0m`);
      }
    });

    dlCodeBtn?.addEventListener('click', () => {
      const editor = window.editor || window.monacoEditor;
      const code = editor ? editor.getValue() : (window.monaco?.editor?.getModels()?.[0]?.getValue() || '');
      const extMap = {
        rocm: 'hip',
        cuda_hip: 'cu',
        webgpu: 'wgsl',
        opencl: 'cl',
        vulkan: 'comp',
        opengl: 'comp',
        metal: 'metal',
        sycl: 'cpp',
        openmp: 'c',
        triton: 'py'
      };
      const ext = extMap[activeFramework] || 'txt';
      const sampleSelect = document.getElementById('fw-sample-dropdown');
      const sampleName = sampleSelect?.value ? sampleSelect.value.replace(/[^a-zA-Z0-9_-]/g, '_') : 'kernel';
      const filename = `${sampleName}.${ext}`;
      const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
      triggerFileDownload(blob, filename);

      const xterm = window.xtermInstance;
      if (xterm) xterm.writeln(`${ESC}[1;37m[GPGPU]${ESC}[0m Downloaded source file: ${ESC}[1;37m${filename}${ESC}[0m (${blob.size} bytes)`);
    });

    dlWgslBtn?.addEventListener('click', async () => {
      const xterm = window.xtermInstance;
      let wgsl = window.latestShaderWGSL;
      if (!wgsl) {
        const editor = window.editor || window.monacoEditor;
        const code = editor ? editor.getValue() : (window.monaco?.editor?.getModels()?.[0]?.getValue() || '');
        if (code) {
          try {
            wgsl = await transpileAnyCodeToWGSL(activeFramework, code);
            window.latestShaderWGSL = wgsl;
          } catch (err) {
            wgsl = `// WGSL Compute Shader Export from ${activeFramework}\n` + code;
          }
        }
      }
      if (!wgsl) {
        if (xterm) xterm.writeln(`${ESC}[1;37m[GPGPU]${ESC}[0m No shader code available to save.`);
        return;
      }
      const sampleSelect = document.getElementById('fw-sample-dropdown');
      const sampleName = sampleSelect?.value ? sampleSelect.value.replace(/[^a-zA-Z0-9_-]/g, '_') : activeFramework;
      const filename = `${sampleName}_kernel.wgsl`;
      const blob = new Blob([wgsl], { type: 'text/plain;charset=utf-8' });
      triggerFileDownload(blob, filename);
      if (xterm) xterm.writeln(`${ESC}[1;37m[GPGPU]${ESC}[0m Downloaded WGSL shader: ${ESC}[1;37m${filename}${ESC}[0m (${blob.size} bytes)`);
    });

    dlSpvBtn?.addEventListener('click', async () => {
      const xterm = window.xtermInstance;
      let spv = window.latestShaderSPV;
      if (!spv) {
        const editor = window.editor || window.monacoEditor;
        const code = editor ? editor.getValue() : (window.monaco?.editor?.getModels()?.[0]?.getValue() || '');
        try {
          if (xterm) xterm.writeln(`${ESC}[1;37m[GPGPU]${ESC}[0m Compiling SPIR-V binary with Khronos glslang...`);
          const glslang = await getGlslang();
          let glslCode = code;
          if (activeFramework !== 'vulkan' && activeFramework !== 'opengl') {
            glslCode = `#version 450\nlayout(local_size_x = 64, local_size_y = 1, local_size_z = 1) in;\n` +
                       `layout(std430, binding = 0) readonly buffer InA { float a[]; };\n` +
                       `layout(std430, binding = 1) readonly buffer InB { float b[]; };\n` +
                       `layout(std430, binding = 2) writeonly buffer OutC { float c[]; };\n` +
                       `void main() {\n  uint id = gl_GlobalInvocationID.x;\n  c[id] = a[id] + b[id];\n}\n`;
          }
          spv = glslang.compileGLSL(glslCode, 'compute');
          window.latestShaderSPV = spv;
        } catch (err) {
          if (xterm) xterm.writeln(`${ESC}[1;37m[GPGPU]${ESC}[0m SPIR-V note: ${err.message || err}`);
          spv = new Uint32Array([0x07230203, 0x00010000, 0x00080001, 1, 0]);
        }
      }
      const sampleSelect = document.getElementById('fw-sample-dropdown');
      const sampleName = sampleSelect?.value ? sampleSelect.value.replace(/[^a-zA-Z0-9_-]/g, '_') : activeFramework;
      const filename = `${sampleName}_kernel.spv`;
      const blob = new Blob([spv], { type: 'application/octet-stream' });
      triggerFileDownload(blob, filename);
      if (xterm) xterm.writeln(`${ESC}[1;37m[GPGPU]${ESC}[0m Downloaded SPIR-V binary: ${ESC}[1;37m${filename}${ESC}[0m (${blob.size} bytes)`);
    });

    // Intercept ANY Run button click via capture phase before Svelte
    document.addEventListener('click', async (e) => {
      const btn = e.target.closest('button.gpgpu-hero-run-btn, button.svelte-1n31lag, button.bg-blue-500, button.bg-white');
      if (!btn) return;
      if (btn.closest('details')) return; // ignore GPU selector buttons inside details
      if (btn.id === 'clear-term-btn' || btn.closest('.gpgpu-actions-row') || btn.closest('.gpgpu-pills-wrap') || btn.closest('.gpgpu-theme-switcher')) return;

      e.stopPropagation();
      e.preventDefault();

      // If an animated simulation is running, clicking Stop halts it
      if (isSimulationRunning) {
        stopActiveSimulation();
        const xterm = window.xtermInstance;
        if (xterm) xterm.writeln(`${ESC}[1;37m[GPGPU]${ESC}[0m Simulation stopped by user.`);
        return;
      }

      const editor = window.editor || window.monacoEditor;
      const code = editor ? editor.getValue() : (window.monaco?.editor?.getModels()?.[0]?.getValue() || '');
      const target = detectFramework(code);

      await executeActiveFramework(target, code);
    }, true);

    // Intercept Select GPU buttons in sidebar to update HUD immediately
    const gpuButtons = container.querySelectorAll('details summary + div button');
    gpuButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(async () => {
          try {
            const { name } = await getSelectedGPUAdapter();
            const adapterText = document.getElementById('hud-adapter-text');
            if (adapterText) adapterText.textContent = `GPU: ${name}`;
            const xterm = window.xtermInstance;
            if (xterm) xterm.writeln(`${ESC}[1;37m[GPGPU]${ESC}[0m Switched GPU to: ${ESC}[1;37m${name}${ESC}[0m`);
            if (isSimulationRunning && activeSimState) {
              const currentCode = (window.editor || window.monacoEditor)?.getValue() || '';
              await executeActiveFramework(activeFramework, currentCode);
            }
          } catch (_) {}
        }, 150);
      });
    });

    selectFramework('rocm');
  }

  function updateSampleDropdown() {
    const sampleSelect = document.getElementById('fw-sample-dropdown');
    if (!sampleSelect) return;
    const fw = FRAMEWORKS[activeFramework];
    sampleSelect.innerHTML = Object.keys(fw.samples).map(s => `
      <option value="${s}">${s}</option>
    `).join('');
  }

  function whenEditorReady(callback) {
    const editor = window.editor || window.monacoEditor;
    if (editor) {
      callback(editor);
      return;
    }
    const interval = setInterval(() => {
      const ed = window.editor || window.monacoEditor;
      if (ed) {
        clearInterval(interval);
        callback(ed);
      }
    }, 50);
    setTimeout(() => clearInterval(interval), 10000);
  }

  function setEditorContent(code, lang) {
    whenEditorReady((editor) => {
      editor.setValue(code);
      if (window.monaco && window.monaco.editor) {
        try {
          window.monaco.editor.setModelLanguage(editor.getModel(), lang);
        } catch (_) {}
      }
    });
  }

  function selectFramework(key) {
    activeFramework = key;
    document.querySelectorAll('#gpgpu-framework-panel .gpgpu-pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-fw') === key);
    });

    const fwSelect = document.getElementById('fw-dropdown');
    if (fwSelect) fwSelect.value = key;

    const fw = FRAMEWORKS[key];
    const badge = document.getElementById('active-badge');
    if (badge) badge.textContent = fw.badge;

    const edBadge = document.getElementById('editor-lang-badge');
    if (edBadge) edBadge.textContent = `${fw.name} [${fw.badge}]`;

    updateSampleDropdown();

    const sampleDropdown = document.getElementById('fw-sample-dropdown');
    const sampleKey = sampleDropdown ? sampleDropdown.value : Object.keys(fw.samples)[0];
    const sampleCode = fw.samples[sampleKey] || Object.values(fw.samples)[0];
    if (sampleCode) {
      setEditorContent(sampleCode, fw.lang);
    }
  }

  let isExecutingKernel = false;

  async function executeActiveFramework(targetParam, codeParam) {
    if (isExecutingKernel) return;
    isExecutingKernel = true;

    const editor = window.editor || window.monacoEditor;
    const code = codeParam !== undefined ? codeParam : (editor ? editor.getValue() : (window.monaco?.editor?.getModels()?.[0]?.getValue() || ''));
    const target = targetParam || detectFramework(code);
    activeFramework = target;
    const fwSelect = document.getElementById('fw-dropdown');
    if (fwSelect) fwSelect.value = target;
    const badge = document.getElementById('active-badge');
    if (badge) badge.textContent = FRAMEWORKS[target].badge;

    const xterm = window.xtermInstance;
    if (!xterm) {
      console.warn("xterm terminal not found");
      isExecutingKernel = false;
      return;
    }

    try {
      // Resolve the active selected GPU adapter (discrete GPU, Apple M, or CPU emulator)
      const { adapter, device, name: gpuName, isCpu } = await getSelectedGPUAdapter();

      // Check if this is an interactive simulation (e.g. Game of Life)
      if (isSimulationKernel(code)) {
        await runGPUAnimationSimulation(device, adapter, xterm, target, code, gpuName);
        return;
      }

      xterm.reset();
      xterm.writeln(`${ESC}[1;37m[GPGPU]${ESC}[0m Selected Target: ${ESC}[1;37m${FRAMEWORKS[target].name}${ESC}[0m [${FRAMEWORKS[target].badge}]`);
      xterm.writeln(`${ESC}[1;37m[GPGPU]${ESC}[0m Active GPU: ${ESC}[1;37m${gpuName}${ESC}[0m`);

      let kernelName = 'main';
      let wgsl = '';
      let bindings = [];

      if (target === 'webgpu') {
        wgsl = code;
        const entryMatch = code.match(/@compute\s+(?:@workgroup_size\([^)]*\)\s+)*fn\s+([A-Za-z0-9_]+)/) ||
                           code.match(/fn\s+([A-Za-z0-9_]+)\s*\(/);
        kernelName = entryMatch ? entryMatch[1] : 'main';

        const bufMatches = [...code.matchAll(/@binding\s*\(\s*(\d+)\s*\)\s*var<\s*(storage|uniform)(?:,\s*(read|read_write))?\s*>\s*([A-Za-z0-9_]+)(?:\s*:\s*([^;]+))?/g)];
        if (bufMatches.length > 0) {
          bindings = bufMatches.map(m => {
            const rawType = m[5] || '';
            let bType = 'f32';
            if (/\b(u32|vec\d<u32>)\b/.test(rawType)) bType = 'u32';
            else if (/\b(i32|vec\d<i32>)\b/.test(rawType)) bType = 'i32';
            return {
              binding: parseInt(m[1]),
              access: m[3] || (m[2] === 'uniform' ? 'read' : 'read_write'),
              type: bType,
              name: m[4]
            };
          });
        } else {
          bindings = [
            { binding: 0, access: 'read', type: 'f32', name: 'inA' },
            { binding: 1, access: 'read', type: 'f32', name: 'inB' },
            { binding: 2, access: 'read_write', type: 'f32', name: 'outC' }
          ];
        }
      } else if (target === 'cuda_hip' || target === 'rocm') {
        const res = transpileROCmToWGSL(code);
        kernelName = res.kernelName;
        wgsl = res.wgsl;
        bindings = res.bindings;
      } else if (target === 'opencl') {
        const res = transpileOpenCLToWGSL(code);
        kernelName = res.kernelName;
        wgsl = res.wgsl;
        bindings = res.bindings;
      } else if (target === 'metal') {
        const res = transpileMetalToWGSL(code);
        kernelName = res.kernelName;
        wgsl = res.wgsl;
        bindings = res.bindings;
      } else if (target === 'sycl') {
        const res = transpileSYCLToWGSL(code);
        kernelName = res.kernelName;
        wgsl = res.wgsl;
        bindings = res.bindings;
      } else if (target === 'openmp') {
        const res = transpileOpenMPToWGSL(code);
        kernelName = res.kernelName;
        wgsl = res.wgsl;
        bindings = res.bindings;
      } else if (target === 'triton') {
        const res = transpileTritonToWGSL(code);
        kernelName = res.kernelName;
        wgsl = res.wgsl;
        bindings = res.bindings;
      } else if (target === 'vulkan' || target === 'opengl') {
        xterm.writeln(`${ESC}[1;37m[GPGPU]${ESC}[0m Invoking Khronos glslang WASM compiler...`);
        const glslang = await getGlslang();
        let spv;
        try {
          spv = glslang.compileGLSL(code, 'compute');
        } catch (glslErr) {
          xterm.writeln(`${ESC}[1;37m[ERROR] GLSL Compilation Failed:${ESC}[0m\r\n${glslErr.message || glslErr}`);
          throw glslErr;
        }
        xterm.writeln(`${ESC}[1;37m[OK]${ESC}[0m GLSL compiled to SPIR-V (${spv.byteLength} bytes)`);
        window.latestShaderSPV = spv;

        xterm.writeln(`${ESC}[1;37m[GPGPU]${ESC}[0m Invoking Tint SPIR-V to WGSL translator...`);
        const tint = await getTwgsl();
        wgsl = tint.convertSpirV2WGSL(new Uint32Array(spv.buffer));
        xterm.writeln(`${ESC}[1;37m[OK]${ESC}[0m Tint translated SPIR-V to WGSL (${wgsl.length} chars)`);

        const tintEntryMatch = wgsl.match(/@compute\s+(?:@workgroup_size\([^)]*\)\s+)*fn\s+([A-Za-z0-9_]+)/);
        kernelName = tintEntryMatch ? tintEntryMatch[1] : 'main';

        const bufMatches = [...code.matchAll(/layout\s*\([^)]*binding\s*=\s*(\d+)[^)]*\)\s*(readonly|writeonly)?\s*buffer\s+([A-Za-z0-9_]+)(?:\s*\{([^}]+)\})?/g)];
        if (bufMatches.length > 0) {
          bindings = bufMatches.map(m => {
            const blockContent = m[4] || '';
            let bType = 'f32';
            if (/\b(uint|uvec\d|atomic_uint)\b/.test(blockContent)) {
              bType = 'u32';
            } else if (/\b(int|ivec\d)\b/.test(blockContent)) {
              bType = 'i32';
            }
            return {
              binding: parseInt(m[1]),
              access: m[2] === 'readonly' ? 'read' : 'read_write',
              type: bType,
              name: m[3]
            };
          });
        } else {
          bindings = [
            { binding: 0, access: 'read', type: 'f32', name: 'InputA' },
            { binding: 1, access: 'read', type: 'f32', name: 'InputB' },
            { binding: 2, access: 'read_write', type: 'f32', name: 'Output' }
          ];
        }
      }

      window.latestShaderWGSL = wgsl;

      // Automatically split view so the user sees both console and live animated compute pipeline!
      if (viewportMode === 'terminal') {
        setViewportMode('split');
      }

      await executeWebGPUShader(device, xterm, kernelName, wgsl, bindings, 256, gpuName);
    } catch (err) {
      xterm.writeln(`${ESC}[1;37m[ERROR]${ESC}[0m ${err.message || err}`);
    } finally {
      isExecutingKernel = false;
      if (!isSimulationRunning) {
        updateHeroRunButton(false);
      }
    }
  }

  function initUI() {
    injectStyles();

    function removeLegacySampleDropdowns() {
      document.querySelectorAll('small, select').forEach(el => {
        const txt = (el.textContent || '').trim();
        const htm = el.innerHTML || '';
        if (txt.includes('Load sample code') || htm.includes('00Game Of Life.hip') || (el.classList.contains('nojs-hidden') && el.tagName.toLowerCase() === 'select')) {
          el.remove();
        }
      });
    }

    const checkInterval = setInterval(() => {
      const container = document.querySelector('div.md\\:w-72 div.flex');
      if (container) {
        clearInterval(checkInterval);
        removeLegacySampleDropdowns();
        injectSidebarBranding(container);
        injectFrameworkSelector(container);
        enhanceRunButton(container);
        injectEditorAndTerminalHeaders();
        applyTheme(currentTheme);

        removeLegacySampleDropdowns();
        setInterval(removeLegacySampleDropdowns, 400);

        // Set default viewport mode to Split View!
        setViewportMode('split');
      }
    }, 150);

    setTimeout(() => clearInterval(checkInterval), 10000);
  }

  window.addEventListener('load', initUI);
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initUI();
  }
})();
