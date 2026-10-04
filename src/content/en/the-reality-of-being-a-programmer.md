---
title: "The Reality of Being a Programmer: Why Reading Code is Far More Important Than Writing It"
description: "A survival guide for aspiring software engineers: from the illusion of generative AI speed, the importance of algorithmic foundations, reading technical documentation, to the value of internships."
pubDate: 2026-10-05T10:00:00Z
coverImage: "/images/the-reality-of-being-a-programmer.webp"
tags: ["journal", "software-engineer", "opinion", "mindset", "beginner"]
isDraft: false
---

If you plan to dive into the world of _software engineering_, prepare yourself to face a technical reality that is rarely discussed: you must build the mental endurance to read.

Based on my experience—from my early days of learning to code (2019-2022) to operating fully as a _solo developer_ (2023-present)—the daily grind of a _programmer_ is not 100% typing syntax in front of a screen. In fact, **60-80% of our time is spent reading and understanding code, tracing _stack trace errors_, and dissecting documentation.** Only the remaining time is actually used to write the code itself. Even over the last three years, where my routine has focused more on the _maintenance_ and dependency updates of my Play Store apps, this reading ratio has become even more massive.

## The Instant Syndrome in the Generative AI Era

There is a rather concerning phenomenon when observing the learning trends of aspiring _programmers_ today. The era of artificial intelligence and generative _tools_ has birthed an instant gratification mentality. Speeding up workflows using AI is indeed efficient, but sacrificing the process of deep understanding just to get a line of code that "simply works" is a ticking time bomb for the system you are building.

I started my career during a transition period. The internet was adequate, but solutions still existed as scattered _puzzle_ pieces across StackOverflow, official documentation, and open forums. Manually piecing these fragments together taught the fundamental essence of this profession: **absolute patience and high-level meticulousness.**

Let's look at the fundamental difference between instant "hallucinated" AI code often _copy-pasted_ by beginners, compared to code designed through the process of reading documentation and understanding architecture:

```kotlin
// ❌ INSTANT CODE (AI Copy-Paste Style):
// It runs, but it blocks the UI thread, lacks error handling, and is extremely hard to scale.
fun fetchUserData() {
    val url = URL("[https://api.example.com/user](https://api.example.com/user)")
    val connection = url.openConnection() as HttpURLConnection
    if (connection.responseCode == 200) {
        val result = connection.inputStream.bufferedReader().readText()
        println(result) // Manual parsing that is prone to crashing
    }
}

// ✅ STRUCTURED CODE (The Result of Reading & Understanding Concepts):
// Safely asynchronous, modular, and features clear error handling.
suspend fun fetchUserData(apiService: ApiService): Result<User> {
    return try {
        val response = apiService.getUser()
        if (response.isSuccessful && response.body() != null) {
            Result.Success(response.body()!!)
        } else {
            Result.Error(Exception("Failed to fetch data: ${response.code()}"))
        }
    } catch (e: Exception) {
        Result.Error(e)
    }
}
```

> **Case Study: The Augmented Reality Project Crisis**
> When ChatGPT first _boomed_, a narrative emerged that _coding_ would become fully automated. During that time, I was working on my final Kampus Merdeka project. My team became dysfunctional and nearly failed due to unpreparedness, forcing me to take over almost the entire development process.
>
> The biggest challenge was resolving _errors_ in the _Augmented Reality_ (AR) implementation on _smartphones_. The AI at that time only provided code hallucinations that wouldn't even _compile_. With only one week left before the deadline, I spent **days solely reading raw documentation and tracking down the root cause (_debugging_)**. The module was finally executed successfully not because of instant _copy-paste_ code, but due to the meticulousness of manually dissecting the _library_'s workflow.

## A Logical Roadmap for Beginners

In a lightning-fast tech ecosystem, the pressure to know every single update is high. However, you are not required to master all of them. Simply knowing that a technology exists is often enough to build your insight. If you are just starting out, apply the following structured steps:

### 1. Build a Logical Foundation Without _Libraries_

Start with **Algorithms and Basic Programming**. Choose one solid programming language (like Kotlin, Java, or Python) that supports procedural and Object-Oriented Programming (OOP) paradigms. **Do not touch modern _frameworks_ in this phase.**

Focus on solving raw logical problems. While the effects won't instantly change your life overnight, this phase will permanently forge _Computational Thinking_ into the structure of your brain.

### 2. Pick One Battlefield (Avoid FOMO)

Once your algorithmic foundation is solid, map out the existing technologies: _Web Apps_, _Mobile Apps_, _Game Development_, or _Artificial Intelligence_.

In various discussions with fellow students and developers, the advice I always emphasize is: **Pick one field and focus on it exclusively.** Don't fall victim to FOMO (_Fear of Missing Out_) by jumping between programming languages (_tech stack switching_) just because of a fleeting trend. Master that field until you can produce real, useful work. Becoming an expert in one domain is far more valuable than knowing a little bit about everything but being unable to build anything.

### 3. Master the Software Ecosystem (Non-Coding)

Writing code is only a fraction of _software engineering_. You must start reading and understanding the system development lifecycle:

- _Software Development Life Cycle_ (SDLC)
- Development Methodologies (Agile/Scrum)
- Software Architecture (e.g., Clean Architecture)
- Relational Database Design

### 4. Seek Real-World Experience (Internships)

Aside from formal training, the most valuable experience you will gain is by diving directly into the industry through an internship program. This is where you will acquire new knowledge and a picture of the working world that is impossible to get just from classes or tutorials. Try to discuss things more often with _senior developers_ at your internship and use that momentum to build your network.

Of course, the reality of internships isn't always pretty. It's entirely possible that you'll be placed in a company that forces you into grueling, exploitative work. If you find yourself in this situation, try to endure it briefly and maintain good behavior; at the very least, you gain a bad experience that serves as a valuable lesson for finding a healthier environment in the future. This happened to a friend of mine who had a terrible internship at Company X, before eventually securing a great internship and a full-time position at Company Y.

To be honest, I am a bit embarrassed discussing this part because I personally never reached the stage of interning at an IT company. Time constraints and past financial conditions forced me to take any job available, which ultimately led me to become a teacher while simultaneously working independently as an _indie developer_. However, for those of you who have the opportunity and time, the internship route is not to be missed.

## Debunking Myths: Mathematics and English

**"Does a programmer have to be good at math?"**
The answer is **No**, unless you specifically take the _Machine Learning_ or _Data Science_ path, which strictly requires an understanding of calculus and linear algebra.

For the majority of _software engineering_ fields, you are only required to master **logic**. [As I previously discussed in my journal about the impact of coding on life](https://herdianurdin.my.id/en/blog/the-impact-of-coding-on-life/), in the realm of mathematics, you have to calculate from A to Z manually. In the programming world, you simply design the framework and rules, then let the computer's processor execute the rest.

**"Does a programmer have to be fluent in English?"**
The answer is **Absolutely, at least passively (reading comprehension).**

Almost 100% of technology documentation, StackOverflow forums, and SDK release notes are written in English. It must be understood that general conversational English is very different from _Technical English_. I do not claim to be an English expert myself, but the habit of constantly reading technical documentation has made me accustomed to understanding its context and instructions.

## Conclusion

Becoming a _programmer_ is a declaration to become a lifelong learner. After completing your foundations and your internship, the decision is in your hands: whether you want to continue a career in an IT company or build your own products as an _indie developer_. Whichever path you choose, keep learning, discuss often, maintain good relationships with fellow developers, and most importantly, never be too lazy to read.
