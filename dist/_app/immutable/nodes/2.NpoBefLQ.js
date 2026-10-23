const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["../chunks/Monaco.DXhOdfi5.js","../chunks/disclose-version.RTEs8xEL.js","../chunks/runtime.xh2qDP5C.js","../chunks/preload-helper.peJpBs2T.js","../chunks/index-client.DuOsW1Kq.js","../assets/Monaco.BXE7G3-b.css"])))=>i.map(i=>d[i]);
import{a as _n,i as X,p as de,b as Ge,_ as re,c as vn}from"../chunks/preload-helper.peJpBs2T.js";import{b as Me,e as pn,a as T,t as L,d as Ne,c as mn}from"../chunks/disclose-version.RTEs8xEL.js";import{z as ge,A as be,C as Ze,D as He,as as gn,b as Oe,h as M,O as xe,at as bn,au as ce,ab as Qe,a2 as Be,_ as we,an as Te,av as Ue,a7 as Re,d as ke,a8 as _e,ap as xn,g as J,c as wn,F as kn,K as ve,B as yn,T as Je,a5 as Cn,a6 as Ke,J as Ie,aw as pe,ax as In,S as En,ay as Dn,f as $e,L as en,P as Hn,az as Ae,aA as Le,aB as nn,aC as Tn,aD as On,I as tn,Q as Rn,N as An,aE as Ln,a4 as Sn,aF as zn,a9 as an,aa as Pn,aG as Wn,p as rn,u as Gn,j as on,a0 as Y,m as a,x as H,ar as ne,v as I,t as B,w as k,i as me,s as $,aH as Ye,aI as Mn}from"../chunks/runtime.xh2qDP5C.js";import{d as Nn,s as V,a as Bn}from"../chunks/render.DbvF1B_J.js";import{o as Un}from"../chunks/index-client.DuOsW1Kq.js";let Xe=!1;function Kn(){Xe||(Xe=!0,document.addEventListener("reset",n=>{Promise.resolve().then(()=>{if(!n.defaultPrevented)for(const e of n.target.elements)e.__on_r?.()})},{capture:!0}))}function Yn(n){var e=Ze,t=He;ge(null),be(null);try{return n()}finally{ge(e),be(t)}}function Xn(n,e,t,i=t){n.addEventListener(e,()=>Yn(t));const r=n.__on_r;r?n.__on_r=()=>{r(),i(!0)}:n.__on_r=()=>i(!0),Kn()}const Ee=0,he=1,De=2;function Fn(n,e,t,i,r){M&&xe();var c=n,h=gn(),y=wn,s=Be,O,u,E,z=(h?we:Te)(void 0),_=(h?we:Te)(void 0),v=!1;function g(w,C){v=!0,C&&(be(P),ge(P),Ue(y));try{w===he&&i&&(u?Re(u):u=ke(()=>i(c,z))),w!==Ee&&O&&_e(O,()=>O=null),w!==he&&u&&_e(u,()=>u=null),w!==De&&E&&_e(E,()=>E=null)}finally{C&&(Ue(null),ge(null),be(null),xn())}}var P=Oe(()=>{if(s!==(s=e())){if(bn(s)){var w=s;v=!1,w.then(C=>{w===s&&(ce(z,C),g(he,!0))},C=>{if(w===s)throw ce(_,C),g(De,!0),_.v}),M||Qe(()=>{v||g(Ee,!0)})}else ce(z,s),g(he,!1);return()=>s=Be}});M&&(c=J)}function oe(n,e){return e}function Vn(n,e,t,i){for(var r=[],c=e.length,h=0;h<c;h++)In(e[h].e,r,!0);var y=c>0&&r.length===0&&t!==null;if(y){var s=t.parentNode;En(s),s.append(t),i.clear(),Q(n,e[0].prev,e[c-1].next)}Dn(r,()=>{for(var O=0;O<c;O++){var u=e[O];y||(i.delete(u.k),Q(n,u.prev,u.next)),$e(u.e,!y)}})}function le(n,e,t,i,r,c=null){var h=n,y={flags:e,items:new Map,first:null},s=(e&nn)!==0;if(s){var O=n;h=M?ve(en(O)):O.appendChild(kn())}M&&xe();var u=null,E=!1;Oe(()=>{var z=t(),_=yn(z)?z:z==null?[]:Je(z),v=_.length;if(E&&v===0)return;E=v===0;let g=!1;if(M){var P=h.data===Cn;P!==(v===0)&&(h=Ke(),ve(h),Ie(!1),g=!0)}if(M){for(var w=null,C,S=0;S<v;S++){if(J.nodeType===8&&J.data===Hn){h=J,g=!0,Ie(!1);break}var N=_[S],f=i(N,S);C=ln(J,y,w,null,N,f,S,r,e),y.items.set(f,C),w=C}v>0&&ve(Ke())}if(!M){var b=Ze;qn(_,y,h,r,e,(b.f&pe)!==0,i)}c!==null&&(v===0?u?Re(u):u=ke(()=>c(h)):u!==null&&_e(u,()=>{u=null})),g&&Ie(!0),t()}),M&&(h=J)}function qn(n,e,t,i,r,c,h,y){var s=(r&Tn)!==0,O=(r&(Ae|Le))!==0,u=n.length,E=e.items,z=e.first,_=z,v,g=null,P,w=[],C=[],S,N,f,b;if(s)for(b=0;b<u;b+=1)S=n[b],N=h(S,b),f=E.get(N),f!==void 0&&(f.a?.measure(),(P??=new Set).add(f));for(b=0;b<u;b+=1){if(S=n[b],N=h(S,b),f=E.get(N),f===void 0){var d=_?_.e.nodes_start:t;g=ln(d,e,g,g===null?e.first:g.next,S,N,b,i,r),E.set(N,g),w=[],C=[],_=g.next;continue}if(O&&jn(f,S,b,r),f.e.f&pe&&(Re(f.e),s&&(f.a?.unfix(),(P??=new Set).delete(f))),f!==_){if(v!==void 0&&v.has(f)){if(w.length<C.length){var p=C[0],o;g=p.prev;var x=w[0],A=w[w.length-1];for(o=0;o<w.length;o+=1)Fe(w[o],p,t);for(o=0;o<C.length;o+=1)v.delete(C[o]);Q(e,x.prev,A.next),Q(e,g,x),Q(e,A,p),_=p,g=A,b-=1,w=[],C=[]}else v.delete(f),Fe(f,_,t),Q(e,f.prev,f.next),Q(e,f,g===null?e.first:g.next),Q(e,g,f),g=f;continue}for(w=[],C=[];_!==null&&_.k!==N;)(c||!(_.e.f&pe))&&(v??=new Set).add(_),C.push(_),_=_.next;if(_===null)continue;f=_}w.push(f),g=f,_=f.next}if(_!==null||v!==void 0){for(var m=v===void 0?[]:Je(v);_!==null;)(c||!(_.e.f&pe))&&m.push(_),_=_.next;var l=m.length;if(l>0){var W=r&nn&&u===0?t:null;if(s){for(b=0;b<l;b+=1)m[b].a?.measure();for(b=0;b<l;b+=1)m[b].a?.fix()}Vn(e,m,W,E)}}s&&Qe(()=>{if(P!==void 0)for(f of P)f.a?.apply()}),He.first=e.first&&e.first.e,He.last=g&&g.e}function jn(n,e,t,i){i&Ae&&ce(n.v,e),i&Le?ce(n.i,t):n.i=t}function ln(n,e,t,i,r,c,h,y,s,O){var u=(s&Ae)!==0,E=(s&On)===0,z=u?E?Te(r):we(r):r,_=s&Le?we(h):h,v={i:_,v:z,k:c,a:null,e:null,prev:t,next:i};try{return v.e=ke(()=>y(n,z,_),M),v.e.prev=t&&t.e,v.e.next=i&&i.e,t===null?e.first=v:(t.next=v,t.e.next=v.e),i!==null&&(i.prev=v,i.e.prev=v.e),v}finally{}}function Fe(n,e,t){for(var i=n.next?n.next.e.nodes_start:t,r=e?e.e.nodes_start:t,c=n.e.nodes_start;c!==i;){var h=tn(c);r.before(c),c=h}}function Q(n,e,t){e===null?n.first=t:(e.next=t,e.e.next=t&&t.e),t!==null&&(t.prev=e,t.e.prev=e&&e.e)}function Ve(n,e,t,i,r){var c=n,h="",y;Oe(()=>{if(h===(h=e()??"")){M&&xe();return}y!==void 0&&($e(y),y=void 0),h!==""&&(y=ke(()=>{if(M){J.data;for(var s=xe(),O=s;s!==null&&(s.nodeType!==8||s.data!=="");)O=s,s=tn(s);if(s===null)throw Rn(),An;Me(J,O),c=ve(s);return}var u=h+"",E=pn(u);Me(en(E),E.lastChild),c.before(E)}))})}function Z(n,e,t,i){var r=n.__attributes??={};M&&(r[e]=n.getAttribute(e),e==="src"||e==="srcset"||e==="href"&&n.nodeName==="LINK")||r[e]!==(r[e]=t)&&(e==="style"&&"__styles"in n&&(n.__styles={}),e==="loading"&&(n[Ln]=t),t==null?n.removeAttribute(e):typeof t!="string"&&Zn(n).includes(e)?n[e]=t:n.setAttribute(e,t))}var qe=new Map;function Zn(n){var e=qe.get(n.nodeName);if(e)return e;qe.set(n.nodeName,e=[]);for(var t,i=n,r=Element.prototype;r!==i;){t=zn(i);for(var c in t)t[c].set&&e.push(c);i=Sn(i)}return e}function se(n,e,t){var i=n.__className,r=Qn(e);M&&n.className===r?n.__className=r:(i!==r||M&&n.className!==r)&&(e==null&&!t?n.removeAttribute("class"):n.className=r,n.__className=r)}function Qn(n,e){return(n??"")+""}function sn(n,e,t){if(n.multiple)return et(n,e);for(var i of n.options){var r=ue(i);if(_n(r,e)){i.selected=!0;return}}(!t||e!==void 0)&&(n.selectedIndex=-1)}function Jn(n,e){an(()=>{var t=new MutationObserver(()=>{var i=n.__value;sn(n,i)});return t.observe(n,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),()=>{t.disconnect()}})}function $n(n,e,t=e){var i=!0;Xn(n,"change",r=>{var c=r?"[selected]":":checked",h;if(n.multiple)h=[].map.call(n.querySelectorAll(c),ue);else{var y=n.querySelector(c)??n.querySelector("option:not([disabled])");h=y&&ue(y)}t(h)}),an(()=>{var r=e();if(sn(n,r,i),i&&r===void 0){var c=n.querySelector(":checked");c!==null&&(r=ue(c),t(r))}n.__value=r,i=!1}),Jn(n)}function et(n,e){for(var t of n.options)t.selected=~e.indexOf(ue(t))}function ue(n){return"__value"in n?n.__value:n.value}function nt(n,e,t,i,r){var c=()=>{i(t[n])};t.addEventListener(e,c),Pn(()=>{t[n]=r()}),(t===document.body||t===window||t===document)&&Wn(()=>{t.removeEventListener(e,c)})}const tt=`#include <unistd.h>

#include <cstdint>
#include <cstdio>
#include <cstdlib>

#define CHECK_ERR(f)                                                                     \\
    if (cudaError_t e = (f)) {                                                           \\
        printf("CUDA failure %s:%d: '%s'\\n", __FILE__, __LINE__, cudaGetErrorString(e)); \\
        exit(1);                                                                         \\
    }

#define BLOCK_WIDTH 32
#define BLOCK_HEIGHT 8
// the grid size will be these divided by the block size
#define WORLD_WIDTH 512
#define WORLD_HEIGHT 32 * 11

// Must be multiple of 32 for bit-packing
static_assert(WORLD_WIDTH % 32 == 0);
static_assert(WORLD_HEIGHT % BLOCK_HEIGHT == 0);

// For storing expanded state in shared memory (including halo cells)
#define SHARED_WIDTH (BLOCK_WIDTH + 2)
#define SHARED_HEIGHT (BLOCK_HEIGHT + 2)

// This is a CUDA kernel - code that runs on the GPU
// __global__ means it's called from CPU and runs on GPU
// Each thread runs this code independently
__global__ void gameOfLife(uint32_t* d_grid, uint32_t* d_newGrid, int width, int height) {
    // Shared memory: Fast memory shared between threads in the same block is
    // declared with __shared__. In this example, every input element is read
    // multiple times by different threads within a block, so memory bandwidth
    // is reduced by moving it on-chip first
    __shared__ uint32_t sharedMem[SHARED_HEIGHT][SHARED_WIDTH];

    // Calculate global indices using a 2D grid and 2D block
    int globalX = blockIdx.x * BLOCK_WIDTH + threadIdx.x;
    int globalY = blockIdx.y * BLOCK_HEIGHT + threadIdx.y;

    // Calculate packed indices
    int packedWidth = width / 32;  // Number of uint32_t per row
    int packedX = globalX / 32;    // Which uint32_t in the row
    int bitOffset = globalX % 32;  // Which bit in the uint32_t

    // Local indices for shared memory
    int localX = threadIdx.x + 1;
    int localY = threadIdx.y + 1;

    // Load and unpack cells into shared memory
    // Load center cells
    uint32_t packedCell = 0;
    if (globalY < height && packedX < packedWidth) {
        packedCell = d_grid[globalY * packedWidth + packedX];
    }

    // Each thread unpacks its bit and stores it in shared memory
    sharedMem[localY][localX] = (packedCell >> bitOffset) & 1;

    // Handle halo cells
    if (threadIdx.x == 0 && blockIdx.x > 0) {
        // Left edge - need last bit from previous packed word
        int prevPackedX = (globalX - 1) / 32;
        int prevBitOffset = 31;  // Last bit of previous word
        uint32_t prevWord = d_grid[globalY * packedWidth + prevPackedX];
        sharedMem[localY][0] = (prevWord >> prevBitOffset) & 1;
    }

    if (threadIdx.x == BLOCK_WIDTH - 1 && blockIdx.x < gridDim.x - 1) {
        // Right edge - need first bit from next packed word
        int nextPackedX = (globalX + 1) / 32;
        int nextBitOffset = 0;  // First bit of next word
        uint32_t nextWord = d_grid[globalY * packedWidth + nextPackedX];
        sharedMem[localY][localX + 1] = (nextWord >> nextBitOffset) & 1;
    }

    // Handle vertical edges (top/bottom)
    if (threadIdx.y == 0 && globalY > 0) {
        uint32_t topWord = d_grid[(globalY - 1) * packedWidth + packedX];
        sharedMem[0][localX] = (topWord >> bitOffset) & 1;
    }

    if (threadIdx.y == BLOCK_HEIGHT - 1 && globalY < height - 1) {
        uint32_t bottomWord = d_grid[(globalY + 1) * packedWidth + packedX];
        sharedMem[localY + 1][localX] = (bottomWord >> bitOffset) & 1;
    }

    // Handle corners
    if (threadIdx.x == 0 && threadIdx.y == 0 && blockIdx.x > 0 && globalY > 0) {
        int prevPackedX = (globalX - 1) / 32;
        uint32_t cornerWord = d_grid[(globalY - 1) * packedWidth + prevPackedX];
        sharedMem[0][0] = (cornerWord >> 31) & 1;
    }

    __syncthreads();

    // Calculate next generation using shared memory
    int neighbors = 0;

    // Count neighbors
    for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
            if (dx == 0 && dy == 0) continue;
            neighbors += sharedMem[localY + dy][localX + dx];
        }
    }

    // Apply Game of Life rules
    bool currentCell = sharedMem[localY][localX];
    bool newCell = currentCell;

    if (currentCell && (neighbors < 2 || neighbors > 3)) {
        newCell = false;
    } else if (!currentCell && neighbors == 3) {
        newCell = true;
    }

    __syncthreads();

    sharedMem[localY][localX] = newCell;

    __syncthreads();

    // TODO: make more efficient: if warp size == 32, then
    // 31 out of 32 threads sit idle (branch divergence)
    if (threadIdx.x % 32 == 0) {
        uint32_t packedResult = 0;

        // Pack 32 horizontal cells into one uint32_t
        for (int i = 0; i < 32 && (globalX + i) < width; i++) {
            bool cell = sharedMem[localY][localX + i];
            packedResult |= (cell << i);
        }

        // Write packed result to global memory
        d_newGrid[globalY * packedWidth + packedX] = packedResult;
    }
}

// Host function to initialize the grid with bit-packing
void initializeGrid(uint32_t* grid, int width, int height) {
    int packedWidth = width / 32;
    for (int y = 0; y < height; y++) {
        for (int x = 0; x < packedWidth; x++) {
            uint32_t packedCell = 0;
            for (int bit = 0; bit < 32; bit++) {
                if (rand() % 2) {
                    packedCell |= (1u << bit);
                }
            }
            grid[y * packedWidth + x] = packedCell;
        }
    }
}

void printGrid(uint32_t* grid, int width, int height) {
    // Print sixel header with dimensions
    printf("\\033Pq\\"1;1;%d;%d\\n", width, height);

    // Define colors: 0 for background (black), 1 for live cells (green)
    printf("#0;2;0;0;0#1;2;0;100;0\\n");

    // Process grid in strips of 6 pixels high (sixel format)
    for (int y = 0; y < height; y += 6) {
        // Select color for live cells
        printf("#1");

        for (int x = 0; x < width; x++) {
            uint8_t sixelChar = 0;

            // Build sixel character for this column (6 pixels)
            for (int subY = 0; subY < 6 && (y + subY) < height; subY++) {
                int currentY = y + subY;
                int packedX = x / 32;
                int bitOffset = x % 32;
                bool cell = (grid[currentY * (width / 32) + packedX] >> bitOffset) & 1;

                if (cell) {
                    sixelChar |= (1 << subY);
                }
            }

            printf("%c", sixelChar + 63);  // Sixel data starts at ASCII 63
        }

        // Move to next row of sixels
        printf("$-");  // $ moves carriage to first column, next row
    }

    // End sixel output
    printf("\\033\\\\\\n");
}


int main() {
    int width = WORLD_WIDTH;
    int height = WORLD_HEIGHT;
    int packedWidth = width / 32;
    size_t size = packedWidth * height * sizeof(uint32_t);

    // Allocate host memory
    uint32_t* h_grid = (uint32_t*)malloc(size);
    uint32_t* h_newGrid = (uint32_t*)malloc(size);

    // Initialize grid
    initializeGrid(h_grid, width, height);

    // Allocate device memory
    uint32_t *d_grid, *d_newGrid;
    CHECK_ERR(cudaMalloc(&d_grid, size));
    CHECK_ERR(cudaMalloc(&d_newGrid, size));

    // Copy initial grid to device
    CHECK_ERR(cudaMemcpy(d_grid, h_grid, size, cudaMemcpyHostToDevice));

    // Set up grid and block dimensions
    dim3 blockDim(BLOCK_WIDTH, BLOCK_HEIGHT);
    dim3 gridDim((width + BLOCK_WIDTH - 1) / BLOCK_WIDTH,
                 (height + BLOCK_HEIGHT - 1) / BLOCK_HEIGHT);

    // Main simulation loop
    int generations = 200;
    for (int gen = 0; gen < generations; gen++) {
        gameOfLife<<<gridDim, blockDim>>>(d_grid, d_newGrid, width, height);

        std::swap(d_grid, d_newGrid);

        CHECK_ERR(cudaMemcpy(h_grid, d_grid, size, cudaMemcpyDeviceToHost));
        printGrid(h_grid, width, height);
        printf("^^ Generation %d ^^\\n", gen);
        usleep(1000 * 100);
    }

    // Cleanup
    free(h_grid);
    free(h_newGrid);
    CHECK_ERR(cudaFree(d_grid));
    CHECK_ERR(cudaFree(d_newGrid));
}
`,at=`#include <cstdio>
#include <vector>

#define CHECK_ERR(f)                                                                     \\
    if (cudaError_t e = (f)) {                                                           \\
        printf("CUDA failure %s:%d: '%s'\\n", __FILE__, __LINE__, cudaGetErrorString(e)); \\
        exit(1);                                                                         \\
    }

// Constant memory: Special read-only memory visible to all threads
// Great for lookup tables and constants used by all threads

// (currently, HipScript emulates constant memory as a standard read-write
// global variable with no special performance advantages.)
__constant__ float deviceConstants[256];

// This is a CUDA kernel - code that runs on the GPU
// __global__ means it's called from CPU and runs on GPU
// Each thread runs this code independently

// Kernels can be generic: the compiler will find every usage by the host-side
// code and generate a corresponding kernel
template <typename T>
__global__ void simpleKernel(T *input, T *output, int n) {
    // Thread indexing with a 1D block and 1D grid:
    // threadIdx.x - position within a block (like a local ID)
    // blockIdx.x - which block this thread is in
    // blockDim.x - size of each block
    // This calculation gives each thread a unique global ID
    int idx = blockIdx.x * blockDim.x + threadIdx.x;

    // Shared memory: Fast memory shared between threads in the same block is
    // declared with __shared__. In this example, every input element is read
    // twice by different threads within a block, so memory bandwidth is reduced
    // by moving it on-chip first
    __shared__ T sharedData[256];

    // Load data into shared memory
    // Each thread loads one element
    if (idx < n) sharedData[threadIdx.x] = input[idx];

    // Synchronize threads in this block
    // All threads must reach this point before any can continue
    __syncthreads();

    // Early exit if this thread is beyond our data size.
    // Needed since each block has a fixed size. For example, with a block size
    // of 256 and a input size of 513, 3 blocks must be launched with the last
    // one only processing one element.
    if (idx >= n) return;

    // Do some computation using shared memory and constant memory
    auto result = sharedData[blockDim.x - threadIdx.x - 1] +
                  sharedData[threadIdx.x] * deviceConstants[threadIdx.x % 256];

    // Debug print (format string and values are written to a special buffer by
    // the GPU, then formatted by the CPU afterwards)
    printf("Thread %d computed %f\\n", idx, result);

    // Write result to global memory
    output[idx] = result;
}

int main() {
    const int N = 1000;
    const int threadsPerBlock = 256;
    const size_t size = N * sizeof(float);
    // Calculate number of blocks needed
    // (N + threadsPerBlock - 1) / threadsPerBlock is ceiling division
    const int numBlocks = (N + threadsPerBlock - 1) / threadsPerBlock;

    // Host (CPU) arrays
    std::vector<float> hostInput(N);
    std::vector<float> hostOutput(N);
    float hostConstants[256];

    // Device (GPU) arrays
    float *deviceInput, *deviceOutput;

    // Initialize host data
    for (int i = 0; i < N; i++) {
        hostInput[i] = i;
    }
    for (int i = 0; i < 256; i++) {
        hostConstants[i] = 1.0f / (i + 1);
    }

    // Allocate GPU memory
    CHECK_ERR(cudaMalloc(&deviceInput, size));
    CHECK_ERR(cudaMalloc(&deviceOutput, size));

    // Copy data to GPU
    CHECK_ERR(cudaMemcpy(deviceInput, hostInput.data(), size, cudaMemcpyHostToDevice));
    // ToSymbol required for global variables
    CHECK_ERR(cudaMemcpyToSymbol(deviceConstants, hostConstants, 256 * sizeof(float)));

    // Launch kernel
    // <<<numBlocks, threadsPerBlock>>> is CUDA launch syntax
    // numBlocks = number of thread blocks
    // threadsPerBlock = threads per block
    simpleKernel<<<numBlocks, threadsPerBlock>>>(deviceInput, deviceOutput, N);

    // Copy results back to CPU
    CHECK_ERR(cudaMemcpy(hostOutput.data(), deviceOutput, size, cudaMemcpyDeviceToHost));

    // Print first few results
    for (int i = 0; i < 5; i++) {
        printf("hostOutput[%d] = %f\\n", i, hostOutput[i]);
    }

    // Cleanup
    CHECK_ERR(cudaFree(deviceInput));
    CHECK_ERR(cudaFree(deviceOutput));
}
`,rt=`#include <cstdio>

__global__ void kernel() {
    printf("Hello World!\\n");
}

int main() {
    kernel<<<1, 1>>>();
}
`,je=`<svg width="24" height="24" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.0429 21H3.95705C2.41902 21 1.45658 19.3364 2.22324 18.0031L10.2662 4.01533C11.0352 2.67792 12.9648 2.67791 13.7338 4.01532L21.7768 18.0031C22.5434 19.3364 21.581 21 20.0429 21Z" stroke="currentColor" stroke-linecap="round"/>
<path d="M12 9V13" stroke="currentColor" stroke-linecap="round"/>
<path d="M12 17.01L12.01 16.9989" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,it=`<svg width="24" height="24" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 11.5V16.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 7.51L12.01 7.49889" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;function ot(n,e){const t=URL.createObjectURL(new Blob([e])),i=document.createElement("a");i.href=t,i.download=n,document.body.appendChild(i),i.click(),URL.revokeObjectURL(t)}var lt=(n,e)=>e.selectSample(n.target.value),st=L("<option> </option>"),dt=L(`<p class="text-center">You might need to enable flags to enable it on your browser. Check out about:gpu and
				about:flags. If you're using Linux, try launching like:</p> <code>chromium --enable-unsafe-webgpu --enable-features=Vulkan</code> <p class="text-center">or</p> <code>google-chrome --enable-unsafe-webgpu --enable-features=Vulkan</code>`,1),ct=L('<p class="text-center">Please try a Chromium-based browser like Google Chrome or Microsoft Edge.</p>'),ut=L('<p class="mb-2 mt-8 text-center text-3xl font-bold">WebGPU Not Available</p> <!>',1),ft=L("<button> </button>"),ht=L('<span class="ml-1"><!></span>'),_t=L("<li> <!></li>"),vt=L('<details class="nojs-hidden"><summary class="text-2xl font-semibold">Select GPU</summary> <div></div> <p class="font-medium">GPU Information</p> <ul class="mb-2"></ul></details> <button><!></button>',1),pt=L("<option> </option>"),mt=L('<select class="my-2 block w-full rounded-md border-transparent bg-gray-100 p-2 focus:border-gray-500 focus:bg-white focus:ring-0 dark:bg-gray-800 focus:dark:bg-gray-900"><option>Download intermediate file...</option><!></select>'),gt=L('Enable Chrome flag <a class="font-mono text-sm" href="chrome://flags/#enable-webgpu-developer-features">enable-webgpu-developer-features</a> to avoid this.',1),bt=L('<details class="mb-1 rounded bg-orange-200 p-2 text-orange-950 dark:bg-orange-950 dark:text-orange-200"><summary class="font-bold">Runtimes may be quantized</summary> Browsers round timestamps by default to protect your privacy. <!></details>'),xt=L('<span class="flex font-bold text-orange-950 dark:text-orange-200"><!> <span class="ml-1"> </span></span>'),wt=L('<span class="relative text-right"><div class="absolute right-0 -z-10 h-full bg-fuchsia-200 dark:bg-fuchsia-950"></div> </span>'),kt=L('<li><!> <div class="grid grid-cols-3"><span class="col-span-2 line-clamp-1 overflow-ellipsis"> <span class="font-mono"> </span></span> <!></div> <div class="grid grid-cols-2 space-x-1"><span class="relative line-clamp-1 overflow-ellipsis"><div class="absolute right-0 -z-10 h-full bg-blue-200 dark:bg-blue-900"></div> </span> <span class="relative line-clamp-1 overflow-ellipsis text-right"><div class="absolute right-0 -z-10 h-full bg-sky-200 dark:bg-sky-900"></div> </span></div></li>'),yt=L('<li class="italic text-center">No kernels executed</li>'),Ct=L('<!> <div class="mb-1 text-center text-2xl font-bold">Kernels Executed</div> <div class="flex w-full text-pretty border-b text-center font-semibold"><span class="flex-1">NDRange / Grid Size</span> <span class="flex-1">Workgroup / Block Size</span></div> <ol class="-mx-2 flex h-full flex-col divide-y overflow-y-auto tabular-nums"></ol>',1),It=L('<div class="flex h-full flex-col overflow-hidden p-2 dark:bg-slate-900 dark:text-white"><h1 class="text-center text-3xl font-[650]">GPGPU</h1> <p class="text-center font-medium leading-tight">Offline Multi-Paradigm GPU Compute Studio</p> <p class="text-center font-[425] text-xs text-slate-400">ROCm • WebGPU • CUDA • OpenCL • Vulkan • Metal • SYCL • OpenMP • Triton</p> <small class="nojs-hidden">Load sample code:</small> <select class="nojs-hidden block w-full rounded-md border-transparent bg-gray-100 p-2 focus:border-gray-500 focus:bg-white focus:ring-0 dark:bg-gray-800 focus:dark:bg-gray-900"></select> <noscript></noscript> <!> <!> <!></div>');function Et(n,e){rn(e,!0);let t=ne(null),i=ne(!0);Gn(()=>{a(t)&&ot(...a(t)),Y(t,null)});let r=ne(null),c=ne(0);Un(async()=>{const d=[{powerPreference:"high-performance"},{powerPreference:"low-power"},{powerPreference:"low-power",forceFallbackAdapter:!0},{xrCompatible:!0}],p=new Map;for(const o of d)try{let A=function(m){let l="";for(const W in m)l+=m[W];return l};const x=await navigator.gpu.requestAdapter(o);if(!x)continue;p.set(A(x.info),{adapter:x,requestAdapterOptions:o})}catch{}Y(r,de([...p.values()])),e.initOk(!!a(r).length)});let h=new AbortController;function y(){Y(i,!1),e.compiling?h.abort():(h=new AbortController,e.run(a(r)?.[a(c)]?.requestAdapterOptions,h.signal))}function s(d){if(d.startsWith("_Z"))try{const p=Number.parseInt(d.substring(2)),o=2+p.toString().length;return d.substring(o,o+p)}catch{}return d}function O(d){return d<1e3?`${d}ns`:d<1e6?`${(d/1e3).toFixed(3)}μs`:`${(d/1e6).toFixed(3)}ms`}const u=$(()=>a(r)?.[a(c)]?.adapter.limits),E=$(()=>a(u)&&[{unless:!a(r)?.[a(c)]?.adapter.isFallbackAdapter,name:"CPU emulator",desc:"This option emulates a GPU with the CPU. Using shared memory will result in a performance decrease rather than increase.",warn:!0},{name:"Max threads per block",num:a(u).maxComputeInvocationsPerWorkgroup,warn:a(u).maxComputeInvocationsPerWorkgroup<1024,desc:"There is a fixed limit of the number of threads that can be launched in a block/workgroup. ",warnDesc:" This is below the standard CUDA limit of 1024."},{name:"Max shared memory bytes",num:a(u).maxComputeWorkgroupStorageSize,desc:"Threads within a block/workgroup share access to a limited amount of extremely fast on-chip memory."},{unless:!a(u).minSubgroupSize,name:"Warp/Wavefront Size",num:a(u).minSubgroupSize===a(u).maxSubgroupSize?a(u).minSubgroupSize:`${a(u).minSubgroupSize}–${a(u).maxSubgroupSize}`,warn:a(u).minSubgroupSize!==a(u).maxSubgroupSize||a(u).minSubgroupSize!==32,warnLevel:"info",desc:"The warp size is the number of threads that are executed in lockstep.",warnDesc:" All CUDA capable GPUs have a fixed warp size of 32. Code written with this in mind may not perform as expected."}].filter(({unless:d})=>!d)),z=/^.*?\d*([^/]*)\.[^./]*$/,_=$(()=>e.kernels&&{maxRuntime:Math.max(...e.kernels.kernels.map(d=>d.duration||0)),maxGrid:Math.max(...e.kernels.kernels.map(d=>d.gx*d.gy*d.gz))});var v=It(),g=H(I(v),8);g.__input=[lt,e],le(g,21,()=>Object.keys(e.samples),oe,(d,p)=>{var o=st(),x={},A=I(o,!0);B(()=>V(A,z.exec(a(p))[1])),k(o),B(()=>{x!==(x=a(p))&&(o.value=(o.__value=a(p))==null?"":a(p))}),T(d,o)}),k(g);var P=H(g,4);{var w=d=>{var p=ut(),o=H(me(p),2);{var x=m=>{var l=dt();Ye(6),T(m,l)},A=m=>{var l=ct();T(m,l)};X(o,m=>{window.chrome?m(x):m(A,!1)})}T(d,p)},C=d=>{var p=vt(),o=me(p),x=H(I(o),2);le(x,21,()=>a(r)||[],oe,(R,D,U)=>{let F=()=>a(D).adapter.info;var K=ft();K.__click=()=>Y(c,de(U));var q=I(K);k(K),B(()=>{se(K,`${"mb-2 rounded border p-1 capitalize transition-colors"+(U===a(c)?" bg-green-200 text-green-950 dark:bg-green-900 dark:text-green-100":" bg-transparent text-black dark:text-white")} svelte-1n31lag`),V(q,`${F().vendor??""} ${(F().vendor===F().architecture?"":F().architecture)??""}`)}),T(R,K)}),k(x);var A=H(x,4);le(A,21,()=>a(E),oe,(R,D)=>{var U=_t(),F=I(U),K=H(F);{var q=te=>{var ae=ht(),ye=I(ae);Ve(ye,()=>({info:it})[a(D).warnLevel]||je),k(ae),T(te,ae)};X(K,te=>{a(D).warn&&te(q)})}k(U),B(()=>{se(U,`${"flex"+(a(D).warn&&({info:" text-blue-800 dark:text-blue-300"}[a(D).warnLevel]||" text-orange-700 dark:text-orange-300"))} svelte-1n31lag`),Z(U,"title",(a(D).desc||"")+(a(D).warn&&a(D).warnDesc||"")),V(F,`${a(D).name+(a(D).num==null?"":":")}
						${a(D).num??""} `)}),T(R,U)}),k(A),k(o);var m=H(o,2);m.__click=y;var l=I(m);{var W=R=>{var D=Ne("Cancel");T(R,D)},G=R=>{var D=Ne("Run");T(R,D)};X(l,R=>{e.compiling?R(W):R(G,!1)})}k(m),B(()=>{se(x,`${"grid space-x-2 font-medium "+(a(r)?.length>1?"grid-cols-2":"")} svelte-1n31lag`),se(m,`${"nojs-hidden w-full rounded px-4 py-2 font-bold"+(e.compiling?" bg-red-500 text-white hover:bg-red-700":" bg-blue-500 text-white hover:bg-blue-700")} svelte-1n31lag`)}),nt("open","toggle",o,R=>Y(i,R),()=>a(i)),T(d,p)};X(P,d=>{a(r)&&!a(r).length?d(w):d(C,!1)})}var S=H(P,2);{var N=d=>{var p=mt(),o=I(p);o.value=(o.__value=null)==null?"":null;var x=H(o);le(x,17,()=>Object.entries(e.outputs),oe,(A,m)=>{let l=()=>a(m)[0],W=()=>a(m)[1];var G=pt(),R={},D=I(G,!0);k(G),B(()=>{R!==(R=[l(),W()])&&(G.value=(G.__value=[l(),W()])==null?"":[l(),W()]),V(D,l())}),T(A,G)}),k(p),$n(p,()=>a(t),A=>Y(t,A)),T(d,p)};X(S,d=>{Object.keys(e.outputs).length&&d(N)})}var f=H(S,2);{var b=d=>{var p=Ct(),o=me(p);{var x=m=>{var l=bt(),W=H(I(l),2);{var G=R=>{var D=gt();Ye(2),T(R,D)};X(W,R=>{window.chrome&&R(G)})}k(l),T(m,l)};X(o,m=>{e.kernels.timestampsQuantized&&m(x)})}var A=H(o,6);le(A,21,()=>e.kernels?.kernels,oe,(m,l,W)=>{var G=kt();const R=$(()=>a(l).bx*a(l).by*a(l).bz),D=$(()=>a(l).gx*a(l).gy*a(l).gz);var U=I(G);{var F=ee=>{var j=xt(),ie=I(j);Ve(ie,()=>je);var fe=H(ie,2),hn=I(fe,!0);k(fe),k(j),B(()=>V(hn,a(l).status==="aborted"?"Aborted":"Error: hover for details")),T(ee,j)};X(U,ee=>{a(l).status&&ee(F)})}var K=H(U,2),q=I(K);B(()=>Z(q,"title",s(a(l).name)));var te=I(q);te.nodeValue=`${W+1}. `;var ae=H(te),ye=I(ae,!0);B(()=>V(ye,s(a(l).name))),k(ae),k(q);var dn=H(q,2);{var cn=ee=>{var j=wt(),ie=I(j),fe=H(ie);B(()=>V(fe,` ${O(a(l).duration)??""}`)),k(j),B(()=>{Z(j,"title",`${a(l).duration}ns`),Z(ie,"style",`width: ${a(l).duration/a(_).maxRuntime*100}%`)}),T(ee,j)};X(dn,ee=>{"duration"in a(l)&&ee(cn)})}k(K);var Se=H(K,2),Ce=I(Se),ze=I(Ce),un=H(ze);k(Ce);var Pe=H(Ce,2),We=I(Pe),fn=H(We);k(Pe),k(Se),k(G),B(()=>{se(G,`${"z-0 px-2 py-1"+(a(l).status&&" bg-orange-200 dark:bg-orange-950")} svelte-1n31lag`),Z(G,"title",a(l).status),Z(ze,"style",`width: ${a(D)/a(_).maxGrid*100}%`),V(un,` ${a(l).gx??""}×${a(l).gy??""}×${a(l).gz??""} (${a(D)??""})`),Z(We,"style",`width: ${a(R)/1024*100}%`),V(fn,` ${a(l).bx??""}×${a(l).by??""}×${a(l).bz??""} (${a(R)??""})`)}),T(m,G)},m=>{var l=yt();T(m,l)}),k(A),T(d,p)};X(f,d=>{e.kernels!=null&&d(b)})}k(v),T(n,v),on()}Nn(["input","click"]);var Dt=L('<meta name="description" content="Online compiler for HIP and NVIDIA® CUDA® code to WebGPU">'),Ht=L('<div class="flex w-full flex-col-reverse md:h-screen md:flex-row"><div class="flex h-full flex-1 flex-col justify-between overflow-hidden"><div class="flex min-h-[60vh] flex-1 flex-col md:min-h-0"><!></div> <div class="h-[424px] p-2 pr-0"></div></div> <div class="md:w-72"><!></div></div>');function St(n,e){rn(e,!0);const t=Object.assign({"/src/lib/samples/00Game Of Life.hip":tt,"/src/lib/samples/01Tour.hip":at,"/src/lib/samples/02Hello World.hip":rt}),i={foreground:"#eff0eb",background:"#282a36",selection:"#97979b33",black:"#282a36",brightBlack:"#686868",red:"#ff5c57",brightRed:"#ff5c57",green:"#5af78e",brightGreen:"#5af78e",yellow:"#f3f99d",brightYellow:"#f3f99d",blue:"#57c7ff",brightBlue:"#57c7ff",magenta:"#ff6ac1",brightMagenta:"#ff6ac1",cyan:"#9aedfe",brightCyan:"#9aedfe",white:"#f1f1f0",brightWhite:"#eff0eb"};let r,c,h,y,s,O=ne(!1),u=ne(null),E=ne(de({}));async function z(f){const{Terminal:b}=await re(async()=>{const{Terminal:o}=await import("../chunks/xterm.Cq48BPY1.js").then(x=>x.x);return{Terminal:o}},[],import.meta.url),{FitAddon:d}=await re(async()=>{const{FitAddon:o}=await import("../chunks/addon-fit.CyyJcX4C.js").then(x=>x.a);return{FitAddon:o}},[],import.meta.url);s=new b({theme:i}),await re(async()=>{const{ImageAddon:o}=await import("../chunks/addon-image.C4llUpio.js").then(x=>x.a);return{ImageAddon:o}},[],import.meta.url).then(({ImageAddon:o})=>s.loadAddon(new o)),await re(async()=>{const{ClipboardAddon:o}=await import("../chunks/addon-clipboard.PdsPX-Ou.js").then(x=>x.a);return{ClipboardAddon:o}},[],import.meta.url).then(({ClipboardAddon:o})=>s.loadAddon(new o));const p=new d;if(s.loadAddon(p),(window.xtermInstance=s,s.open(r)),p.fit(),new ResizeObserver(()=>p.fit()).observe(r),s.writeln("Initializing..."),!f){s.writeln("Not downloading compiler with unsupported browser");return}if(h=re(()=>import("../chunks/run.DGAQdi1i.js"),[],import.meta.url),localStorage.getItem("hipscript-crash")){s.writeln("Your browser might have crashed during the last attempt, not starting automatic compilation.");return}y=h.then(o=>o.init(s))}async function _(f,b){try{Y(O,!0),Y(u,null),Y(E,de({})),y||(y=h.then(d=>d.init(s))),await y,Y(u,de(await(await h).compile(f,c.getData(),s,b,(d,p)=>a(E)[d]=p)))}finally{Y(O,!1)}}var v=Ht();Bn(f=>{var b=Dt();Mn.title="GPGPU: Run GPU compute code in the browser with WebGPU",T(f,b)});var g=I(v),P=I(g),w=I(P);Fn(w,()=>re(()=>import("../chunks/Monaco.DXhOdfi5.js"),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url),null,(f,b)=>{var d=$(()=>{var{default:m}=a(b);return{Component:m}}),p=$(()=>a(d).Component),o=mn(),x=me(o),A=$(()=>localStorage.getItem("hipscript-content")||Object.values(t)[0]);vn(x,()=>a(p),(m,l)=>{Ge(l(m,{get contents(){return a(A)}}),W=>c=W,()=>c)}),T(f,o)}),k(P);var C=H(P,2);Ge(C,f=>r=f,()=>r),k(g);var S=H(g,2),N=I(S);Et(N,{run:_,get compiling(){return a(O)},get kernels(){return a(u)},samples:t,get outputs(){return a(E)},initOk:z,selectSample:f=>c?.setData(t[f])}),k(S),k(v),B(()=>Z(C,"style",`background: ${i.background}`)),T(n,v),on()}export{St as component};
//# sourceMappingURL=2.NpoBefLQ.js.map
