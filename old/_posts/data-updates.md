---
title: 'When will Fall/Spring/Summer 20XX data get added?'
date: '2025-07-06T10:49:53.850Z'
id: 2
---

## When will Fall/Spring/Summer 20XX data get added?

<details>
  <summary>Outdated answer from before July 3, 2025</summary>

As of January 27, 2022, requests for new grade data are sent automatically via email to UH.

- **Fall data** is requested on <ins>January 28</ins> every year
- **Spring data** is requested on <ins>May 30</ins> every year
- **Summer data** is requested on <ins>August 30</ins> every year

This is to give UH time to finalize their grades and so we are not harassing their staff after or during any holidays. UH typically takes about a week to respond with the data, and sometimes even longer. Once we have the data from UH, adding the data to the site is a semi-automated process that takes about 1-2 hours.

</details>

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

With help from the UH community, maybe your contributions can too. Your support of current and future UH students would be much appreciated.

Please see the below instructions for how additional data can be added to the site.

#### CougarGrades Volunteer Data Request Process:

1. 🛑 **HEADS UP**. This process is for volunteers (potentially you) to do the following:
    - You will send a formal request data to the University of Houston on behalf of the CougarGrades project
    - You will interact with a representative of the University of Houston over email
    - You will hopefully receive grade data in the form of CSV files or Microsoft Excel spreadsheets from the representative you interacted
    - You will upload the grade data (the CSV/Excel files) you received to the CougarGrades project on GitHub
        - Alternatively, you will forward the files you received to <u>contact\[at\]cougargrades.io</u>
1. **🛑 If these things don't sound like things you're up for, don't go any further! Stop now!** We appreciate you coming this far.
1. Determine which semesters (if any) are missing from CougarGrades. This can be done by looking at the _"Latest Data"_ field in the footer of our website.
    - If a **"⚠️" is visible**, then some semesters are missing from our grade dataset. Hover your mouse over this symbol to reveal which semesters we're looking for.
    ![missing data](/img/missing_data.png)
    - If this symbol cannot be found, then our grade dataset is currently up-to-date. There's nothing left for you to do!
1. Request for the missing data from UH by following their official process:
    - [https://uh.edu/ir/request-data/](https://uh.edu/ir/request-data/)
    - **Alternatively:**
        - An email template is provided below that should be sent to <u>publicinfo@uh.edu</u>. Clicking the link below will open the email template in the email client associated with your operating system.
        - <a href="mailto:publicinfo@uh.edu?body=Dear%20Public%20Information%20Officer%2C%0A%0APursuant%20to%20the%20Texas%20Public%20Information%20Act%2C%20I%20am%20making%20a%20request%20for%20information%20from%20the%20University%20of%20Houston.%0A%0AHere%20is%20my%20personal%20information%3A%0AName%3A%20YOUR%20NAME%0APhone%20%23%3A%20YOUR%20PHONE%20NUMBER%0AAddress%3A%20YOUR%20ADDRESS%0A%0AI%20am%20requesting%20official%20course%20grade%20distribution%20data%20for%20all%20UH%20undergraduate%20and%20graduate%20courses%20from%20Spring%202025.%20The%20data%20should%20match%20the%20format%20used%20in%20past%20UH%20public%20records%2C%20as%20shown%20in%3A%0Ahttps%3A%2F%2Fgithub.com%2Fcougargrades%2Fpublicdata%2Ftree%2Fmaster%2Fdocuments%2Fedu.uh.grade_distribution%0A%0AEach%20record%20should%20include%3A%0A%E2%80%A2%20Term%0A%E2%80%A2%20Subject%20Code%0A%E2%80%A2%20Course%20Number%0A%E2%80%A2%20Section%20Number%0A%E2%80%A2%20Instructor%28s%29%0A%E2%80%A2%20Grade%20counts%20for%20A%2C%20B%2C%20C%2C%20D%2C%20F%2C%20W%2C%20etc.%0A%0APlease%20provide%20the%20data%20in%20CSV%20or%20a%20similar%20machine-readable%20format.&subject=Public%20Information%20Data%20Request%20Form%2C%20University%20of%20Houston">[📧 Email Template]</a>

5. In your request and in their response, ensure that the data is received in the format described in our source code:
    - [https://github.com/cougargrades/publicdata/tree/master/documents/edu.uh.grade_distribution](https://github.com/cougargrades/publicdata/tree/master/documents/edu.uh.grade_distribution)

<details>
    <summary>An example of your Data Request could be:</summary>
    <pre style="white-space: pre-wrap;word-wrap: break-word;">
From: YOUR NAME &lt;YOUR_EMAIL@gmail.com&gt;
Date: Sun, Jun 1, 2025 at 6:37 PM
Subject: Public Information Data Request Form, University of Houston
To: &lt;publicinfo@uh.edu&gt;

Dear Public Information Officer,

Pursuant to the Texas Public Information Act, I am making a request for information from the University of Houston. I have attached the request form, and I will also put my information below.

Here is my personal information:
Name: YOUR NAME
Phone #: (832)111-1111
Address: 1 Main St, Houston, TX 77002

I am requesting official course grade distribution data for all UH undergraduate and graduate courses from \_\_\_\_ 20XX to the most recent available semester. The data should match the format used in past UH public records, as shown in:
https://github.com/cougargrades/publicdata/tree/master/documents/edu.uh.grade_distribution

Each record should include:
• Term
• Subject Code
• Course Number
• Section Number
• Instructor(s)
• Grade counts for A, B, C, D, F, W, etc.

Please provide the data in CSV or a similar machine-readable format.

Here is a Raw CSV data sample:
TERM,SUBJECT,CATALOG NBR,CLASS SECTION,CLASS NUMBER,COURSE DESCR,INSTR LAST NAME,INSTR FIRST NAME,A,B,C,D,F,SATISFACTORY,NOT REPORTED,TOTAL DROPPED,AVG GPA
Spring 2021,LAW,5136,1,16227,Interscholastic Moot Ct Retro,Lawrence,Jim E,0,0,0,0,0,8,0,0,0
Spring 2021,BIOL,6315,2,273 62,Neuroscience,Ziburkus,Jokubas,10,0,0,0,0,0,0,0,3.967
Spring 2021,PHYS,8399,29,15931,Doctoral Dissertation,Ren,Zhifeng,0,0,0,0,0,2,0,0,0
Spring 2021,MANA,4347,2,24479,Ethics and Corp Soc Respon.,Im,Taehoon,26,16,1,0,0,5,0,0,3.188
Spring 2021,ECON,4373,1,24259,Economics of Financial Crises,Paluszynski,Radoslaw,8,6,2,0,0,17,0,1,1.227
Spring 2021,CIVE,3434,3,20513,Fluid Mech and Hydraulic Engr,Momen,Mostafa,19,24,1,0,0,11,0,0,2.643
    </pre>
</details>

6. Wait until you've received the grade data from a representative of the University of Houston. _This may take some time._
1. Now that you've acquired the data, do one of the following:
    - **If you have experience using GitHub and would like to be credited in our [About page](/about):**
        1. Make a [Fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) of the [CougarGrades publicdata repository](https://github.com/cougargrades/publicdata)
        1. Add the documents you received from the university to the following folder: [`/documents/edu.uh.grade_distribution`](https://github.com/cougargrades/publicdata/tree/master/documents/edu.uh.grade_distribution)
        1. Make a [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) to our [publicdata GitHub repository](https://github.com/cougargrades/publicdata) adding the Excel/CSV documents that you received without transformations along with proof that they came from UH by providing the EML file of the correspondence with the university
            - See: [Beginner's guide to GitHub: Creating a pull request](https://github.blog/developer-skills/github/beginners-guide-to-github-creating-a-pull-request/)
            - Gmail instructions: [https://support.google.com/mail/answer/9261412?hl=en](https://support.google.com/mail/answer/9261412?hl=en)
            - Outlook instructions: [https://support.microsoft.com/en-us/office/save-an-outlook-message-as-a-eml-file-a-pdf-file-or-as-a-draft-4821bcd4-7687-4d6d-a486-b89a291a56e2](https://support.microsoft.com/en-us/office/save-an-outlook-message-as-a-eml-file-a-pdf-file-or-as-a-draft-4821bcd4-7687-4d6d-a486-b89a291a56e2#:~:text=In%20Mail%2C%20from%20the%20message,the%20menu%2C%20select%20Save%20as.)
        1. On GitHub, make sure your Pull Request [allows for changes from maintainers](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/allowing-changes-to-a-pull-request-branch-created-from-a-fork). This allows the CougarGrades developers to correct any simple formatting issues with the data from UH you've submitted while you still retain full credit for the contribution.

            ![Allow edits from maintainers checkbox](https://github.blog/wp-content/uploads/2016/09/01fa90ba-7443-11e6-952f-a35a34d07c62.png)

        1. On GitHub, I will review your pull request to include the data within the data set. At that point, my goals in the review process are:
            1. To verify the authenticity by viewing the EML file
            1. Check that the data is in the format the source code is expecting. (Don't worry, we'll help if it isn't!)
            1. Verify that the source code doesn't break when I include the new data (it shouldn't, but gotta be careful!)
        1. If all things are good, your Pull Request will be merged and the data you provide will be included in the "publicdata" repository. **As of now, you are a contributor to CougarGrades!** Your contribution will be reflected in our [About page](/about) as a contributor to the project.
    - **If you would like to contribute the grade data anonymously over email:**
        1. Forward your correspondance with the UH representative and the grade data (CSV/Excel files) as attachments to <u>contact\[at\]cougargrades.io</u>
        1. I will review your email and the data attached to ensure it's valid and is the type of data CougarGrades uses
        1. You will remain anonymous and at no point will your information be shared
        1. The grade data you provided will be uploaded to the [CougarGrades publicdata repository](https://github.com/cougargrades/publicdata) without any association to you

1. Now that the grade data has been acquired and added to the project, I will run the [automated scripts for deployment](https://github.com/cougargrades/deployment) and the site will be updated to reflect the new data.
1. Do it again, 3 times a year in total 🫠 (Spring/Summer/Fall)