# Siddiquia Amal Tracker

বাংলা ভাষার একটি মোবাইল-ফ্রেন্ডলি Amal & Zikir tracker।

## চালু করার নিয়ম
1. ZIP ফাইলটি Extract করুন।
2. `index.html`, `manifest.json`, `sw.js` GitHub repository-র root-এ আপলোড করুন।
3. GitHub repository → Settings → Pages → Deploy from a branch নির্বাচন করুন।
4. Branch `main`, folder `/root` নির্বাচন করে Save করুন।
5. প্রকাশিত GitHub Pages URL খুলুন।

## অন্তর্ভুক্ত ফিচার
- নিজের ইচ্ছামতো আমল তৈরি ও সম্পাদনা
- প্রতিটি আমলের আলাদা মোট ও দৈনিক গণনা
- +1, +10, +100, +1000 এবং Undo
- লক্ষ্য ও অগ্রগতির হিসাব
- রিপোর্ট
- JSON ব্যাকআপ ও ইমপোর্ট
- PWA manifest ও service worker

## ডেটা সংরক্ষণ সম্পর্কে গুরুত্বপূর্ণ
এই প্রথম সংস্করণে ডেটা আপনার ব্যবহৃত ব্রাউজারের `localStorage`-এ থাকে। এটি একই ডিভাইস/ব্রাউজারে সংরক্ষিত থাকবে; Firebase cloud sync, user login, multi-device sync এখনো যুক্ত করা হয়নি। ব্রাউজারের ডেটা মুছে গেলে ব্যাকআপ ছাড়া হিসাব ফেরত পাওয়া যাবে না। নিয়মিত Backup Download ব্যবহার করুন।

## পরবর্তী Production ধাপ
Firebase Authentication ও Firestore যুক্ত করে ব্যক্তিগত ক্লাউড ব্যাকআপ, একাধিক ডিভাইসে sync, এবং নিরাপত্তা rules স্থাপন করতে হবে। Firebase project credentials ছাড়া cloud sync সক্রিয় করা সম্ভব নয়।
