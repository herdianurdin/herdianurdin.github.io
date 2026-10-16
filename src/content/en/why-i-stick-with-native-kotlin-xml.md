---
title: "Why I Stick with Native Kotlin (XML): The Reality of a Mid-Range Laptop Developer"
description: "Amidst the hype of Flutter and Jetpack Compose, here is a pragmatic look at why Native Kotlin & XML remains king for developers with limited hardware specs."
pubDate: 2026-10-16T10:00:00+07:00
coverImage: "/images/opini-native-kotlin-xml-vs-cross-platform.webp"
tags:
  [
    "android-developer",
    "kotlin-android",
    "jetpack-compose",
    "flutter-vs-react-native",
    "tech-opinion",
  ]
isDraft: false
idSlug: "opini-native-kotlin-xml-vs-cross-platform"
---

Scroll through LinkedIn or any developer community today, and you will inevitably be bombarded with narratives like: _"Flutter is the future!"_, _"React Native cuts development time in half!"_, or _"Drop XML immediately and switch to Jetpack Compose!"_

These narratives often trigger severe FOMO (Fear Of Missing Out), especially for beginner developers. However, let's put technological ego aside for a moment and face one crucial reality that tech influencers rarely talk about: **Our hardware specifications.**

As a Solo Android Developer who also works as a full-time teacher, I don't have the luxury of coding on the latest M-Series Macbook Pro. My daily driver is a working-class, mid-range laptop.

In this article, I want to share my technical opinion on why—after wandering through various modern frameworks—I chose to return and stick to the classic **Native Kotlin and XML** architecture.

## The Cross-Platform Illusion: Dependency Hell and APK Size

![Illustration of a frustrated programmer dealing with outdated dependency errors and massive node_modules in cross-platform frameworks](/images/ilustrasi-dependency-hell.webp)

Long before I dove deep into Kotlin, my first loves were actually **[React Native](https://reactnative.dev/)** and **[Flutter](https://flutter.dev/)**. The promise was incredibly sweet: write code once, and your app runs flawlessly on both Android and iOS.

However, the honeymoon phase ended quickly when I crashed into technical realities on the ground:

1. **The Tragedy of Dependency Hell:** In the React Native ecosystem, the convenience of JavaScript is paid for with the infamous `node_modules` folder—a black hole that devours laptop storage. Whenever I tried to maintain an app after leaving it for a few months, I'd always find third-party libraries that were deprecated or causing fatal build errors due to version conflicts.
2. **Bloated APK Size:** Flutter is indeed much more stable in performance compared to React Native. Unfortunately, the resulting APK size is massively bloated. A simple app that should be 3 MB can easily skyrocket to over 20 MB because Flutter has to bundle its own C++ rendering engine within the app.

For my target market in Indonesia, a large file size is the number one reason users hit the _Uninstall_ button. As I mentioned in my **[AdMob Revenue Case Study](/en/blog/admob-indonesia-revenue-reality-2026)**, maintaining User Experience (UX) and app stability is the ultimate key if you want to survive long-term in this industry.

## Heartbreak with Jetpack Compose

If cross-platform isn't the answer, didn't Google already release **[Jetpack Compose](https://developer.android.com/compose)** for the Native ecosystem? Yes, absolutely. Compose is a modern, declarative UI toolkit that is clean and fast to write.

Unfortunately, that "future" is not yet ready for my laptop's specifications.

During an Android boot camp in 2022, I used a **Dell Latitude E5450 (Intel Core i5 Gen 5, 16GB RAM, 256GB SSD)**. When I tried the `@Preview` feature in Jetpack Compose, my laptop fans instantly roared like a jet engine, _Android Studio_ completely froze, and the rendering time was agonizing.

Fast forward to 2024, I upgraded to a **Dell Latitude 5300 (Intel Core i5 Gen 8, Windows 11)**. I challenged Compose once again. The result? The preview rendering process while typing code was still too sluggish. My workflow was ruined because I spent more time waiting for the _Build_ loading bar to finish than actually writing logic.

Jetpack Compose is brilliant technology, but forcing yourself to use it on a limited machine will only kill your coding productivity.

## The Power of Native Kotlin + XML for Limited Specs

![Illustration of an offline-first Android Native app with a tiny APK size under 10MB running perfectly stable](/images/ilustrasi-offline-first-app.webp)

Eventually, I returned to the classic combination: Native Kotlin and XML. This is not a step backward; rather, it is the most pragmatic decision. Here are three undeniable advantages of this architecture:

### 1. Instant UI Rendering and Zero Lags

Writing UI layouts using XML in Android Studio feels like taking a deep breath of fresh air. The XML _Design Preview_ feature is incredibly lightweight and instantaneous without burdening the CPU. Even though XML has rigid structural limitations, these constraints actually force us to be more disciplined in designing component hierarchies—a principle that perfectly aligns with ideal **[UI/UX Design Theories](/en/blog/what-is-ui-ux-designer-wireframe-mockup)**.

### 2. Strict APK Diet (Under 10 MB)

Because pure Native Kotlin apps rely entirely on the Android operating system's built-in components, the compiled output is exceptionally slim. For proof, **[Asmaul Husna Arti dan Makna](https://play.google.com/store/apps/details?id=audio_dakwah.asmaul_husna_99.audio_belajar_asmaul_husna)**, an app I developed entirely with this architecture, has an APK output of **under 10 MB**. This ultra-lightweight app successfully reached 50,000+ downloads without a single user complaining about storage issues.

### 3. A Bulletproof "Offline-First" Ecosystem

My primary focus is often building an offline-first architecture (apps that run fully without an internet connection). In cross-platform ecosystems, local database libraries are usually managed by third parties and are prone to being abandoned by their creators.

In the Native Android ecosystem, I use **[Room Database](https://developer.android.com/training/data-storage/room)**. This is a first-party, official library directly from Google. It is guaranteed to always be compatible with the latest Android OS versions. Maintaining an app over a 3 to 5-year lifecycle feels significantly safer technically.

## Conclusion: Don't Be a Victim of FOMO

If you own a god-tier gaming PC or the latest M-Series Macbook, by all means, soar into the future with Jetpack Compose, Flutter, or React Native.

However, if you are an indie developer building your path with limited machine specs, do not let prestige and FOMO hinder your productivity. Users on the Play Store will never decompile your code to see if you used Compose or XML. They only care about one thing: **Is the app lightweight, crash-free, and does it solve their problem?**

Stick with Native Kotlin and XML. Release your work, take care of your users, and later, when your hardware is highly capable, we can step into the next technological era together. _Keep it simple, keep coding!_
