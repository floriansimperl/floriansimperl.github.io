"""Local preview server that disables browser caching, so edits show up on reload.

Run from the repo folder:  python3 serve.py   (then open http://localhost:8000)
"""
from http.server import HTTPServer, SimpleHTTPRequestHandler


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    print("Serving on http://localhost:8000 (no cache). Press Ctrl+C to stop.")
    HTTPServer(("", 8000), NoCacheHandler).serve_forever()
