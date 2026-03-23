import pickle
import requests
import os
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


class CheckDuplicate:
    def __init__(self, model_name, api_url):
        print("Loading model...")
        self.model = SentenceTransformer(model_name)
        self.cache_path = "./.cache/cache.pkl"
        self.api_url = api_url
        self.cache = self.load_db()
    def load_db(self):
        if os.path.exists(self.cache_path):
            with open(self.cache_path, "rb") as f:
                cache = pickle.load(f)
                print(f"[CACHE] Loaded {len(cache)} embeddings")
                return cache
        else:
            return {}
    def save_cache(self):
        with open(self.cache_path, "wb") as f:
            pickle.dump(self.cache, f)
        print(f"[CACHE] Saved {len(self.cache)} embeddings")

    def prepare_text(self, data):
        steps = data.get("steps") or data.get("stepsToReproduce") or ""
        text = data["title"] + " " + steps
        return text.lower().strip()

    # 🔥 NEW: Fetch bugs from API
    def fetch_bugs(self):
        print("[API] Fetching existing bugs...")

        try:
            response = requests.get(self.api_url)
            bugs = response.json()

            print(f"[API] Retrieved {len(bugs)} bugs")
            return bugs

        except Exception as e:
            print("[API] Error fetching bugs:", e)
            return []

    def get_embedding_cached(self, bug):
        bug_id = bug["id"]

        # ✅ Use cache if exists
        if bug_id in self.cache:
            print(f"[CACHE HIT] Bug {bug_id}")
            return self.cache[bug_id]

        # ❗ Compute if not in cache
        print(f"[CACHE MISS] Computing embedding for Bug {bug_id}")

        text = self.prepare_text(bug)
        emb = self.model.encode(text).astype("float32")

        self.cache[bug_id] = emb
        return emb

    def find_duplicates(self, new_emb, bugs):
        print("[SIM] Finding duplicates...")

        results = []

        for bug in bugs:
            emb = self.get_embedding_cached(bug)

            sim = cosine_similarity([new_emb], [emb])[0][0]
            results.append((bug["id"], sim))

        results.sort(key=lambda x: x[1], reverse=True)

        return self.filter_duplicates(results)

    def filter_duplicates(self, results, threshold=0.8):
        return [r for r in results if r[1] >= threshold]

    def main(self, new_bug):
        print("\n===== NEW BUG =====")

        # # Step 1: embedding for new bug (not cached)
        text = self.prepare_text(new_bug)
        new_emb = self.model.encode(text)

        # Step 2: fetch bugs
        bugs = self.fetch_bugs()
        print(bugs)

        # Step 4: find duplicates
        results = self.find_duplicates(new_emb, bugs)

        # # Step 5: save updated cache
        self.save_cache()

        res_ids = [r[0] for r in results]

        print("[RESULT]", res_ids)
        print("===== END =====\n")

        return {"ids": res_ids}

if __name__ == "__main__":
    cd = CheckDuplicate('all-MiniLM-L6-v2', "http://localhost:8080/api/bugs")
    cd.main({"id": 0, "title": "Login button not working", "description": "User cannot login", "steps": "1. Go to login page 2. Click login button"})