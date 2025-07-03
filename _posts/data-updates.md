---
title: 'When will Fall/Spring/Summer 20XX data get added?'
date: '2025-07-03T22:04:45.035Z'
id: 2
---

## When will Fall/Spring/Summer 20XX data get added?

<s rel="outdated">

As of January 27, 2022, requests for new grade data are sent automatically via email to UH.

- **Fall data** is requested on <ins>January 28</ins> every year
- **Spring data** is requested on <ins>May 30</ins> every year
- **Summer data** is requested on <ins>August 30</ins> every year

This is to give UH time to finalize their grades and so we are not harassing their staff after or during any holidays. UH typically takes about a week to respond with the data, and sometimes even longer. Once we have the data from UH, adding the data to the site is a semi-automated process that takes about 1-2 hours.

</s>

### Update (July 3, 2025):

#### New data in CougarGrades is now powered by volunteers



#### Why is CougarGrades getting updated by volunteers? Can't you do it?

Over the years, requesting data from UH has become more involved than it was previously. Although the automated requests helped in starting the process in a timely manner, **requests for all data must be performed by a human.**

**This very-involved human interaction wouldn't be necessary be if UH published the grade data themselves**, like [other Texas universities](https://www.google.com/search?q=site%3A*.edu+texas+grade+distribution) have been doing for years:
- Texas A&amp;M University: [https://web-as.tamu.edu/gradereports/](https://web-as.tamu.edu/gradereports/)
- University of Texas: [https://reports.utexas.edu/spotlight-data/ut-course-grade-distributions](https://reports.utexas.edu/spotlight-data/ut-course-grade-distributions)

My last interaction with UH in ~2022 included "filibuster"-like tactics that disuaded me from continuing the effort on my own. CougarGrades is a hobby project of mine that was very important to me, but I graduated in 2021 and the priorities in my life have shifted since then. I don't have the time or energy to follow-through with these requests on my own.

In May 2025, a supporter of the site reached out to me and volunteered to fetch the current missing data on my behalf. That volunteer was [@adamnelsonarcher](https://github.com/adamnelsonarcher) and the results of their effort [were included in the site](https://github.com/cougargrades/publicdata/pull/47).

This effort from Adam inspired me to open the doors to additional contributors instead of trying to do it all on my own. As a result, the automated emails mentioned above are disabled.

With help from the UH community, maybe your contributions can too. Your support of current and future UH students would be much appreciated. See t

Please see the below instructions for how additional data can be added to the site.

#### CougarGrades Volunteer Data Request Process:

1. Identify how up-to-date the CougarGrades dataset is by looking at the _"Latest Data"_ field in the footer of our website
1. Determine which semesters (if any) are missing from CougarGrades as a result
1. Request for the missing data from UH by following their official process:
    - [https://uh.edu/ir/request-data/](https://uh.edu/ir/request-data/)
1. In your request and in their response, ensure that the data is received in the format described in our source code:
    - [https://github.com/cougargrades/publicdata/tree/master/documents/edu.uh.grade_distribution](https://github.com/cougargrades/publicdata/tree/master/documents/edu.uh.grade_distribution)
1. Make a [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) to our [publicdata GitHub repository](https://github.com/cougargrades/publicdata) adding the Excel/CSV documents that you received without transformations along with proof that they came from UH by providing the EML file of the correspondence with the university
    - Gmail instructions: [https://support.google.com/mail/answer/9261412?hl=en](https://support.google.com/mail/answer/9261412?hl=en)
    - Outlook instructions: [https://support.microsoft.com/en-us/office/save-an-outlook-message-as-a-eml-file-a-pdf-file-or-as-a-draft-4821bcd4-7687-4d6d-a486-b89a291a56e2](https://support.microsoft.com/en-us/office/save-an-outlook-message-as-a-eml-file-a-pdf-file-or-as-a-draft-4821bcd4-7687-4d6d-a486-b89a291a56e2#:~:text=In%20Mail%2C%20from%20the%20message,the%20menu%2C%20select%20Save%20as.)
1. On GitHub, I will review your pull request to include the data within the data set. At that point, my goals in the review process are:
    1. To verify the authenticity by viewing the EML file
    1. Check that the data is in the format the source code is expecting
    1. Verify that the source code doesn't break when I include the new data (it shouldn't, but gotta be careful!)
1. If all things are good, your Pull Request will be merged and the data you provide will be included in the "publicdata" repository. I will run the automated scripts for deployment and the site will be updated to reflect the new data.
1. **Your contribution will be reflected in our [About page](/about) as a contributor to the project.**