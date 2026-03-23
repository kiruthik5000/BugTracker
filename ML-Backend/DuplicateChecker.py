import pickle
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


class CheckDuplicate:
    def __init__(self, model_name):
        print("Loading model...")
        self.model = SentenceTransformer(model_name)

        print("Loading bug database...")
        self.bugs = self.load_db()

    def prepare_text(self, data):
        text = data["title"] + " " + data["description"] + " " + data["steps"]
        text = text.lower().strip()
        return text

    def load_db(self):
        try:
            with open("bugs.pkl", "rb") as f:
                data = pickle.load(f)
                print("Loaded bugs.pkl successfully")
                return data
        except Exception as e:
            print(f"[DB] No existing DB found. Creating new. ({e})")
            return {}

    def save_db(self):
        with open("bugs.pkl", "wb") as f:
            pickle.dump(self.bugs, f)
        print(f"Saved {len(self.bugs)} bugs to bugs.pkl")

    def find_duplicates(self, new_emb):
        print("Finding duplicates...")

        results = []

        if not self.bugs:
            print("No existing bugs to compare")
            return []

        for bug_id in self.bugs:
            sim = cosine_similarity(
                [new_emb],
                [self.bugs[bug_id]["embeddings"]]
            )[0][0]

            results.append((bug_id, sim))

        results.sort(key=lambda x: x[1], reverse=True)

        filtered = self.filter_duplicates(results)

        print(f"{len(filtered)} duplicates found after threshold")

        return filtered

    def filter_duplicates(self, results, threshold=0.8):
        return [r for r in results if r[1] >= threshold]

    def get_embeddings(self, text):
        print("Generating embedding...")
        emb = self.model.encode(text)
        return emb

    def main(self, bug):
        print("\n===== NEW BUG PROCESSING =====")

        text = self.prepare_text(bug)

        embeddings = self.get_embeddings(text)

        # 🔥 FIRST find duplicates
        results = self.find_duplicates(embeddings)

        # THEN store
        print(f" Saving bug ID {bug['id']}")

        self.bugs[bug["id"]] = {
            "text": text,
            "embeddings": embeddings.astype("float32")
        }

        self.save_db()

        res_ids = [r[0] for r in results]

        print(f"Duplicate IDs: {res_ids}")
        print("===== END =====\n")

        return {"ids": res_ids}


if __name__ == "__main__":
    cd = CheckDuplicate('all-MiniLM-L6-v2')

    bug = {
        "id": 5,
        "title": "Backend Database Crash",
        "description": "Queries are not Functional",
        "steps": "Step1 : Remoev the values"
    }

    res = cd.main(bug)
    print(res)