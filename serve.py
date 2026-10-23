#!/usr/bin/env python3
import http.server
import os
import posixpath
import urllib.parse
import sys

PORT = int(os.environ.get("PORT", 5173))
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "dist"))

class GPGPUHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        # Mandatory headers for WebAssembly SharedArrayBuffer / pthreads / WebGPU
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def guess_type(self, path):
        if path.endswith(".wasm"):
            return "application/wasm"
        if path.endswith(".webc"):
            return "application/octet-stream"
        if path.endswith(".mjs"):
            return "application/javascript"
        if path.endswith(".hip"):
            return "text/plain; charset=utf-8"
        return super().guess_type(path)

    def do_GET(self):
        # Fallback to index.html if route not found
        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path) and not os.path.exists(os.path.join(path, "index.html")):
            self.path = "/index.html"
        return super().do_GET()

def run():
    server_address = ("127.0.0.1", PORT)
    httpd = http.server.HTTPServer(server_address, GPGPUHandler)
    print("\n======================================================")
    print("  GPGPU Server is running!")
    print(f"  URL: http://localhost:{PORT}")
    print(f"  Serving assets from: {ROOT}")
    print("  Cross-Origin Isolation enabled (COOP/COEP)")
    print("======================================================\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")

if __name__ == "__main__":
    run()
