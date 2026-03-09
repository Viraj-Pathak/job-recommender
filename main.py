"""
Interactive CLI demo for the Job Recommendation System.
"""

import sys
import pandas as pd
from data_generator import generate_jobs, generate_users, generate_interactions, SKILLS_POOL
from hybrid_recommender import HybridRecommender


def print_banner():
    print("=" * 60)
    print("       JOB RECOMMENDATION SYSTEM (Hybrid ML)")
    print("=" * 60)


def print_user(user: pd.Series):
    print(f"\n  User ID   : {user['user_id']}")
    print(f"  Skills    : {user['skills']}")
    print(f"  Experience: {user['experience_years']} years ({user['experience_level']})")


def print_recommendations(recs: pd.DataFrame):
    if recs.empty:
        print("  No recommendations found.")
        return
    for i, row in recs.iterrows():
        print(f"\n  [{i+1}] {row['title']} | ${row['salary']:,} | {row['experience_level']}")
        print(f"      Skills required : {row['required_skills']}")
        print(f"      Content score   : {row['content_score']:.3f}")
        print(f"      Collab score    : {row['collab_score']:.3f}")
        print(f"      Hybrid score    : {row['hybrid_score']:.3f}")


def main():
    print_banner()
    print("\nGenerating synthetic dataset...")

    jobs = generate_jobs(50)
    users = generate_users(30)
    interactions = generate_interactions(users, jobs)

    print(f"  {len(jobs)} jobs | {len(users)} users | {len(interactions)} interactions")

    print("\nTraining hybrid recommender (content-based 50% + collaborative 50%)...")
    recommender = HybridRecommender(content_weight=0.5, collab_weight=0.5)
    recommender.fit(jobs, users, interactions)
    print("  Model ready.\n")

    while True:
        print("\n" + "-" * 60)
        print("Options:")
        print("  [1] Get recommendations for an existing user (ID 0-29)")
        print("  [2] Get recommendations for a custom user profile")
        print("  [3] Show all users")
        print("  [q] Quit")
        choice = input("\nYour choice: ").strip().lower()

        if choice == "q":
            print("Goodbye!")
            break

        elif choice == "1":
            try:
                uid = int(input("Enter user ID (0-29): ").strip())
                if uid < 0 or uid >= len(users):
                    print("Invalid user ID.")
                    continue
                user = users[users["user_id"] == uid].iloc[0]
                print_user(user)
                recs = recommender.recommend(user_id=uid, top_n=5)
                print(f"\nTop 5 Recommendations for User {uid}:")
                print_recommendations(recs)
            except (ValueError, IndexError):
                print("Invalid input.")

        elif choice == "2":
            print(f"\nAvailable skills: {', '.join(SKILLS_POOL)}")
            skills_input = input("Enter your skills (comma-separated): ").strip()
            skills = [s.strip().lower() for s in skills_input.split(",") if s.strip()]
            if not skills:
                print("No valid skills entered.")
                continue

            try:
                exp_years = int(input("Years of experience: ").strip())
            except ValueError:
                print("Invalid experience.")
                continue

            exp_level = "Junior" if exp_years < 2 else ("Mid" if exp_years < 6 else "Senior")

            # Create a temporary user entry
            custom_user = pd.Series({
                "user_id": 9999,
                "name": "Custom User",
                "skills": " ".join(skills),
                "experience_years": exp_years,
                "experience_level": exp_level,
            })

            print(f"\nCustom profile → Skills: {skills}, Level: {exp_level}")
            # For custom users, only content-based is available (no interactions)
            cb_recs = recommender.content_rec.recommend(custom_user, top_n=5)
            cb_recs = cb_recs.merge(
                jobs[["job_id", "title", "required_skills", "experience_level", "salary"]],
                on="job_id",
            )
            print(f"\nTop 5 Content-Based Recommendations:")
            for i, row in cb_recs.iterrows():
                print(f"\n  [{i+1}] {row['title']} | ${row['salary']:,} | {row['experience_level']}")
                print(f"      Skills required : {row['required_skills']}")
                print(f"      Content score   : {row['content_score']:.3f}")

        elif choice == "3":
            print("\nAll Users:")
            for _, u in users.iterrows():
                print(f"  [{u['user_id']}] {u['experience_level']:6s} | {u['skills']}")

        else:
            print("Invalid option.")


if __name__ == "__main__":
    main()
