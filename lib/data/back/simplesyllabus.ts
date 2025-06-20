import { z } from 'zod/v4'

export const Example = z.object({
    hello: z.string()
})
export type Example = z.infer<typeof Example>



/*
{
    "code": "megwtcr68",
    "title": "ACCT 7337 17848",
    "total": 2,
    "editors": [
    {
        "entity_id": "a68b9805-37ba-4149-b303-c990ff3b647e",
        "full_name": "Denney Wright",
        "last_name": "Wright",
        "first_name": "Denney",
        "has_headshot": false
    }
    ],
    "term_id": "c80f252f-a903-4859-a225-6473131c9fb0",
    "subtitle": "Oil & Gas Taxation",
    "entity_id": "5dc86566-1ae5-444d-a80c-54c9400ea9d0",
    "following": false,
    "term_name": "Fall 2025",
    "is_student": false,
    "entity_type": "section",
    "family_name": "syllabus",
    "has_upload_thumbnail": false,
    "has_published_uploads": false
},
*/

export function SSResponseWrapper<Schema extends z.ZodType<unknown>>(schema: Schema) {
    return z.object({
        sys: z.object({
            success: z.boolean()
        }),
        // other fields ommitted because we don't want to fail if they change their API
        items: schema.array()
    });
}

/**
 * 
 * {
    "code": "megwtcr68",
    "title": "ACCT 7337 17848",
    "total": 2,
    "editors": [
    {
        "entity_id": "a68b9805-37ba-4149-b303-c990ff3b647e",
        "full_name": "Denney Wright",
        "last_name": "Wright",
        "first_name": "Denney",
        "has_headshot": false
    }
    ],
    "term_id": "c80f252f-a903-4859-a225-6473131c9fb0",
    "subtitle": "Oil & Gas Taxation",
    "entity_id": "5dc86566-1ae5-444d-a80c-54c9400ea9d0",
    "following": false,
    "term_name": "Fall 2025",
    "is_student": false,
    "entity_type": "section",
    "family_name": "syllabus",
    "has_upload_thumbnail": false,
    "has_published_uploads": false
    },
 * 
 */
export type SSSearchResult = z.infer<typeof SSSearchResult>
export const SSSearchResult = z.object({
    code: z.string(), // "megwtcr68"
    title: z.string(), // "ACCT 7337 17848"
    subtitle: z.string(), // "Oil & Gas Taxation"
    term_name: z.string(), // "Fall 2025"
    editors: z.object({
        full_name: z.string(),
        entity_id: z.string(),
    }).array()
})

/**
 * 
 * {
    "doc_data": {
        "code": "megwtcr68",
        "status": "completed",
        "created": "2025-03-30T22:50:37.475535-05:00",
        "term_id": "c80f252f-a903-4859-a225-6473131c9fb0",
        "modified": "2025-06-19T03:40:54.214269-05:00",
        "entity_id": "5dc86566-1ae5-444d-a80c-54c9400ea9d0",
        "is_active": true,
        "is_working": false,
        "visibility": "general_public",
        "entity_type": "section",
        "family_name": "syllabus",
        "is_published": true,
        "current_step_number": 0,
        "current_workflow_id": 1,
        "previous_snapshot_id": "1acf5222-4856-4569-b31b-5e885778fc52",
        "published_snapshot_id": "1acf5222-4856-4569-b31b-5e885778fc52",
        "title": "ACCT 7337 17848",
        "sub_title": "Oil & Gas Taxation",
        "entity": {
        "id": "5dc86566-1ae5-444d-a80c-54c9400ea9d0",
        "name": "ACCT 7337 17848",
        "created": "2025-03-13T20:21:53.448337",
        "fulltext": "'17848':3B,8A '20253':5A '7337':2A,7A 'acct':1A,6A 'face':10C,12C 'face-to-fac':9C 'h':4A",
        "modified": "2025-04-30T11:52:30.852708",
        "is_active": true,
        "entity_type": "section"
        },
        "term": {
        "name": "Fall 2025",
        "status": "future",
        "created": "2025-03-10T11:59:30.910647",
        "end_date": "2025-12-15",
        "modified": "2025-03-18T12:32:07.400409",
        "entity_id": "c80f252f-a903-4859-a225-6473131c9fb0",
        "is_active": true,
        "start_date": "2025-08-18",
        "entity_type": "term",
        "is_published": true,
        "is_independent": true,
        "is_self_active": true,
        "is_parent_active": true,
        "syllabus_due_date": null,
        "allow_syllabus_editing": true,
        "allow_course_master_editing": false
        },
        "editors": [
        {
            "role": {
            "id": 6,
            "name": "instructor",
            "created": "2024-09-05T10:12:39.037022",
            "modified": "2025-01-14T09:28:03.764311",
            "is_active": true,
            "role_types": [
                "instructor"
            ],
            "description": "System instructor role that includes the following built-in functionality: edit syllabi, display in instructor component, populate in instructor blocks, instructor conditional logic, auto-import syllabus content, include in Doc Status report",
            "name_plural": "instructors",
            "entity_types": [
                "section"
            ],
            "role_fulltext": "'instructor':1"
            },
            "accounts": [
            {
                "ca_6": "Accountancy & Taxation, Department of; Law",
                "ca_7": "713/743-6253",
                "ca_11": "0111574",
                "email": "dlwrigh2@cougarnet.uh.edu",
                "prefix": "",
                "suffix": "",
                "entity_id": "a68b9805-37ba-4149-b303-c990ff3b647e",
                "entity_type": "account"
            }
            ]
        }
        ],
        "active_users": [
        {
            "role": {
            "id": 6,
            "name": "instructor",
            "created": "2024-09-05T10:12:39.037022",
            "modified": "2025-01-14T09:28:03.764311",
            "is_active": true,
            "role_types": [
                "instructor"
            ],
            "description": "System instructor role that includes the following built-in functionality: edit syllabi, display in instructor component, populate in instructor blocks, instructor conditional logic, auto-import syllabus content, include in Doc Status report",
            "name_plural": "instructors",
            "entity_types": [
                "section"
            ],
            "role_fulltext": "'instructor':1"
            },
            "accounts": [
            {
                "ca_6": "Accountancy & Taxation, Department of; Law",
                "ca_7": "713/743-6253",
                "ca_11": "0111574",
                "email": "dlwrigh2@cougarnet.uh.edu",
                "prefix": "",
                "suffix": "",
                "entity_id": "a68b9805-37ba-4149-b303-c990ff3b647e",
                "entity_type": "account"
            }
            ]
        }
        ],
        "following": false,
        "has_content": null,
        "previous_snapshot": null,
        "rows": null,
        "components": [
        {
            "html": "<div _ngcontent-vrj-c262=\"\" class=\"component-wrapper test-class ng-star-inserted\" id=\"id_5dc86566-1ae5-444d-a80c-54c9400ea9d0_cb9b41b5-1bda-430d-9a6e-bf026bb215b3\"><app-heading-component-variation _ngcontent-vrj-c262=\"\" _nghost-vrj-c267=\"\" class=\"ng-star-inserted\"><div _ngcontent-vrj-c267=\"\" fxlayout=\"\" inviewport=\"\" style=\"flex-direction: row; box-sizing: border-box; display: flex;\"><!----><div _ngcontent-vrj-c267=\"\" fxflex=\"0 1 816px\" class=\"component component-id-cb9b41b5-1bda-430d-9a6e-bf026bb215b3 component-index-1 component-without-name content-component\" style=\"flex: 0 1 816px; box-sizing: border-box; max-width: 816px;\"><!----><app-heading-component-name _ngcontent-vrj-c267=\"\" _nghost-vrj-c264=\"\"><!----><!----></app-heading-component-name><!----><span _ngcontent-vrj-c267=\"\" class=\"ng-star-inserted\"><!----></span><!----><!----><div _ngcontent-vrj-c267=\"\" class=\"component-body component-content-item app-body-view\"><!----><!----><app-heading-component-editor-content _ngcontent-vrj-c267=\"\" ngclass.gt-md=\"heading-component-editor-lg\" _nghost-vrj-c268=\"\" class=\"ng-star-inserted\"><app-form-editor _ngcontent-vrj-c268=\"\" _nghost-vrj-c304=\"\"><!----><div _ngcontent-vrj-c304=\"\" class=\"fr-view ng-star-inserted\" id=\"editor-0.5678977151928479\"><p style=\"text-align: center;\"><img src=\"/ui/account-image/68c60e55-14ec-4841-90af-cdba6c48692f\" style=\"width: 324px;\" class=\"fr-fic fr-dii fr-draggable\" alt=\"University of Houston logo\"></p><h1 style=\"text-align: center;\"><span style=\"font-size: 16pt; color: rgb(200, 16, 46);\"><span class=\"block-container fr-draggable\" contenteditable=\"false\"><span class=\"block-node block-placeholder accessibility-color-contrast-0.6749042712397746\" data-block-default=\"\" data-block-name=\"subject_name\" data-block-title=\"prefix Name\" style=\"font-weight: 700;\">ACCT</span></span> <span class=\"block-container fr-draggable\" contenteditable=\"false\"><span class=\"block-node block-placeholder accessibility-color-contrast-0.21448623255204735 \" data-block-default=\"\" data-block-name=\"course_number\" data-block-title=\"Course Number\" style=\"font-weight: 700;\">7337</span><span class=\"block-node block-suffix\">&nbsp;|&nbsp;</span></span></span><span style=\"font-size: 16pt; color: rgb(84, 88, 90);\"><strong><span class=\"block-container fr-draggable\" contenteditable=\"false\"><span class=\"block-node block-placeholder\" data-block-default=\"\" data-block-name=\"course_title\" data-block-title=\"Course Title\">Oil &amp; Gas Taxation</span></span></strong></span></h1><p style=\"text-align: center;\"><span class=\"block-container fr-draggable\" contenteditable=\"false\"><span class=\"block-node block-prefix\" style=\"font-weight: 700;\">Section:&nbsp;</span><span class=\"block-node block-placeholder\" data-block-default=\"\" data-block-name=\"section_name\" data-block-title=\"Section Name\">17848</span></span> <span class=\"block-container fr-draggable\" contenteditable=\"false\"><span class=\"block-node block-prefix\">|&nbsp;</span><span class=\"block-node block-placeholder\" data-block-default=\"\" data-block-name=\"section_ca_3\" data-block-title=\"Section Mode Of Instruction\" style=\"font-weight: 300;\">Face-to-Face</span></span><br><span class=\"block-container fr-draggable\" contenteditable=\"false\"><span class=\"block-node block-placeholder\" data-block-default=\"\" data-block-name=\"section_ca_8\" data-block-title=\"Section Meeting Days\">Mo 06:00 PM-09:00 PM</span><span class=\"block-node block-suffix\">&nbsp;|</span></span> <span class=\"block-container fr-draggable\" contenteditable=\"false\"><span class=\"block-node block-placeholder\" data-block-default=\"\" data-block-name=\"section_ca_10\" data-block-title=\"Section Meeting Location\">University of Houston; Leroy and Lucile Melcher Hall; MH 114</span></span></p><p style=\"text-align: center;\"><span class=\"block-container fr-draggable\" contenteditable=\"false\"><span class=\"block-node block-placeholder\" data-block-default=\"\" data-block-name=\"course_ca_2\" data-block-title=\"Course Description\">Prerequisite(s): Graduate standing. This course examines the fundamental property concepts governing oil and gas taxation.  Topics include geological and geophysical costs, intangible drilling costs, equipment costs, dry hole costs, and abandonment.</span></span></p></div><!----><!----></app-form-editor></app-heading-component-editor-content><!----><!----></div><div _ngcontent-vrj-c267=\"\" class=\"component-footer component-content-item\"></div></div><!----></div></app-heading-component-variation><!----><!----><!----><!----></div>",
            "locale": "en-US",
            "is_public": true,
            "signature": "cf993b18-bd18-83eb-de91-94c407f71a69",
            "sort_order": 0,
            "word_count": 57,
            "snapshot_id": "1acf5222-4856-4569-b31b-5e885778fc52",
            "component_id": "cb9b41b5-1bda-430d-9a6e-bf026bb215b3",
            "component_type": "content",
            "variation_status": "passed"
        },
        {
            "html": "<div _ngcontent-vrj-c262=\"\" class=\"component-wrapper test-class ng-star-inserted\" id=\"id_5dc86566-1ae5-444d-a80c-54c9400ea9d0_1007064a-5142-4905-bc1f-591296621915\"><app-heading-component-variation _ngcontent-vrj-c262=\"\" _nghost-vrj-c267=\"\" class=\"ng-star-inserted\"><div _ngcontent-vrj-c267=\"\" fxlayout=\"\" inviewport=\"\" style=\"flex-direction: row; box-sizing: border-box; display: flex;\"><!----><div _ngcontent-vrj-c267=\"\" fxflex=\"0 1 816px\" class=\"component component-id-1007064a-5142-4905-bc1f-591296621915 component-index-2 component-with-name instructor-component\" style=\"flex: 0 1 816px; box-sizing: border-box; max-width: 816px;\"><!----><app-heading-component-name _ngcontent-vrj-c267=\"\" _nghost-vrj-c264=\"\"><h2 _ngcontent-vrj-c264=\"\" class=\"component-content-item app-name-view component-name ng-star-inserted\"> General Course Information\n</h2><!----><!----></app-heading-component-name><!----><span _ngcontent-vrj-c267=\"\" class=\"ng-star-inserted\"><!----></span><!----><!----><div _ngcontent-vrj-c267=\"\" class=\"component-body component-content-item app-body-view\"><!----><!----><!----><app-heading-component-editor-list _ngcontent-vrj-c267=\"\" ngclass.gt-md=\"heading-component-editor-lg\" _nghost-vrj-c269=\"\" class=\"ng-star-inserted\"><div _ngcontent-vrj-c269=\"\" class=\"read-only-row-container component-content-item ng-star-inserted\"><!----><app-heading-row-save _ngcontent-vrj-c269=\"\" class=\"component-content-item row-0 ng-star-inserted\"><app-heading-cell-container class=\"ng-star-inserted\"><div fxlayout=\"\" fxlayout.lt-md=\"row wrap\" fxlayoutgap=\"25px\" class=\"heading-cells-container ng-star-inserted\" style=\"flex-flow: row wrap; box-sizing: border-box; display: flex;\"><!----><!----><div fxflex=\"\" style=\"padding-top: 10px; flex: 1 1 0%; box-sizing: border-box;\" class=\"ng-star-inserted\"><app-heading-cell _nghost-vrj-c273=\"\" class=\"component-content-item cell-basic cell-0 list-none ng-star-inserted\"><div _ngcontent-vrj-c273=\"\" class=\"text-cell ng-star-inserted\"><!----><span _ngcontent-vrj-c273=\"\" class=\"cell-content\"> Denney Wright </span></div><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></app-heading-cell><app-heading-cell _nghost-vrj-c273=\"\" class=\"component-content-item cell-basic cell-1 list-none ng-star-inserted\"><div _ngcontent-vrj-c273=\"\" class=\"text-cell ng-star-inserted\"><span _ngcontent-vrj-c273=\"\" class=\"cell-name ng-star-inserted\"> Department: </span><!----><span _ngcontent-vrj-c273=\"\" class=\"cell-content\"> Bauer College of Business, Department of Accountancy and Taxation  </span></div><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></app-heading-cell><app-heading-cell _nghost-vrj-c273=\"\" class=\"component-content-item cell-basic cell-2 list-none ng-star-inserted\"><div _ngcontent-vrj-c273=\"\" class=\"text-cell ng-star-inserted\"><span _ngcontent-vrj-c273=\"\" class=\"cell-name ng-star-inserted\"> Email: </span><!----><span _ngcontent-vrj-c273=\"\" class=\"cell-content\"> dlwrigh2@central.uh.edu  </span></div><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></app-heading-cell><app-heading-cell _nghost-vrj-c273=\"\" class=\"component-content-item cell-basic cell-3 list-none ng-star-inserted\"><div _ngcontent-vrj-c273=\"\" class=\"text-cell ng-star-inserted\"><span _ngcontent-vrj-c273=\"\" class=\"cell-name ng-star-inserted\"> Phone: </span><!----><span _ngcontent-vrj-c273=\"\" class=\"cell-content\"> 713/743-6253 (office) </span></div><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></app-heading-cell><app-heading-cell _nghost-vrj-c273=\"\" class=\"component-content-item cell-basic cell-4 list-none ng-star-inserted\"><!----><div _ngcontent-vrj-c273=\"\" class=\"ng-star-inserted\"><div _ngcontent-vrj-c273=\"\" class=\"ng-star-inserted\"><strong _ngcontent-vrj-c273=\"\" class=\"cell-name\">Office Hours</strong><!----></div><!----><!----><app-form-editor _ngcontent-vrj-c273=\"\" blockmode=\"all\" mode=\"dashed\" class=\"cell-content\" _nghost-vrj-c304=\"\"><!----><div _ngcontent-vrj-c304=\"\" class=\"fr-view ng-star-inserted\" id=\"editor-0.23776173379968135\"><p>I can be available before class each week and a few minutes after each class. If you desire to meet separately, please send an email requesting an appointment. We can meet face-to-face in an office discussion or via a Zoom meeting (whichever mode best fits our schedules). Should you have questions on the materials covered during class, feel free to send an email and I will provide input either by return email or during the next class meeting. &nbsp;</p></div><!----><!----></app-form-editor></div><!----><!----><!----><!----><!----><!----></app-heading-cell><!----></div><!----></div><!----><!----></app-heading-cell-container><!----><!----><!----></app-heading-row-save><!----><!----><!----></div><!----><!----></app-heading-component-editor-list><!----></div><div _ngcontent-vrj-c267=\"\" class=\"component-footer component-content-item\"></div></div><!----></div></app-heading-component-variation><!----><!----><!----><!----></div>",
            "locale": "en-US",
            "is_public": true,
            "signature": "b306c3f8-c746-e183-19a3-244fba275966",
            "sort_order": 1,
            "word_count": 101,
            "snapshot_id": "1acf5222-4856-4569-b31b-5e885778fc52",
            "component_id": "1007064a-5142-4905-bc1f-591296621915",
            "component_type": "instructor",
            "variation_status": "passed"
        },
        {
            "html": "<div _ngcontent-vrj-c262=\"\" class=\"component-wrapper test-class ng-star-inserted\" id=\"id_5dc86566-1ae5-444d-a80c-54c9400ea9d0_a31289f6-9557-47e5-adb6-bc464db53f4b\"><app-heading-component-variation _ngcontent-vrj-c262=\"\" _nghost-vrj-c267=\"\" class=\"ng-star-inserted\"><div _ngcontent-vrj-c267=\"\" fxlayout=\"\" inviewport=\"\" style=\"flex-direction: row; box-sizing: border-box; display: flex;\"><!----><div _ngcontent-vrj-c267=\"\" fxflex=\"0 1 816px\" class=\"component component-id-a31289f6-9557-47e5-adb6-bc464db53f4b component-index-3 component-with-name content-component\" style=\"flex: 0 1 816px; box-sizing: border-box; max-width: 816px;\"><!----><app-heading-component-name _ngcontent-vrj-c267=\"\" _nghost-vrj-c264=\"\"><h2 _ngcontent-vrj-c264=\"\" class=\"component-content-item app-name-view component-name ng-star-inserted\"> Course Objectives and Student Learning Outcomes\n</h2><!----><!----></app-heading-component-name><!----><span _ngcontent-vrj-c267=\"\" class=\"ng-star-inserted\"><!----></span><!----><!----><div _ngcontent-vrj-c267=\"\" class=\"component-body component-content-item app-body-view\"><!----><!----><app-heading-component-editor-content _ngcontent-vrj-c267=\"\" ngclass.gt-md=\"heading-component-editor-lg\" _nghost-vrj-c268=\"\" class=\"ng-star-inserted\"><app-form-editor _ngcontent-vrj-c268=\"\" _nghost-vrj-c304=\"\"><!----><div _ngcontent-vrj-c304=\"\" class=\"fr-view ng-star-inserted\" id=\"editor-0.15622383833819642\"><p id=\"isPasted\">&nbsp;</p><p>Oil and Gas Tax covers the United States federal income taxation of domestic oil and gas operations and transactions. The course examines taxation associated with the operational life cycle of oil and gas operations including exploration, development, production, and abandonment. The study of transactions involving oil and gas interests analyzes acquisition, disposition, structuring, and investment. Course participants learn the historical context and development of oil and gas provisions in the U.S. tax law as a basis for learning the laws and regulations that apply today. Current tax legislative proposals and/or final legislation affecting the oil and gas industry will be addressed as warranted throughout the semester. The emphasis is on federal income taxation of domestic oil and gas transactions, although certain international tax aspects of the oil and gas business will be referenced and contrasted throughout the class. Students gain an understanding of oil and gas taxation issues and how to read, interpret, and apply tax law specific to oil and gas operations and transactions.</p></div><!----><!----></app-form-editor></app-heading-component-editor-content><!----><!----></div><div _ngcontent-vrj-c267=\"\" class=\"component-footer component-content-item\"></div></div><!----></div></app-heading-component-variation><!----><!----><!----><!----></div>",
            "locale": "en-US",
            "is_public": true,
            "signature": "7fe1ce65-9ec9-1892-181e-de8ed7695235",
            "sort_order": 2,
            "word_count": 172,
            "snapshot_id": "1acf5222-4856-4569-b31b-5e885778fc52",
            "component_id": "a31289f6-9557-47e5-adb6-bc464db53f4b",
            "component_type": "content",
            "variation_status": "passed"
        },
        {
            "html": "<div _ngcontent-vrj-c262=\"\" class=\"component-wrapper test-class ng-star-inserted\" id=\"id_5dc86566-1ae5-444d-a80c-54c9400ea9d0_1e35712b-1134-420a-b523-bd885b74ceb1\"><app-heading-component-variation _ngcontent-vrj-c262=\"\" _nghost-vrj-c267=\"\" class=\"ng-star-inserted\"><div _ngcontent-vrj-c267=\"\" fxlayout=\"\" inviewport=\"\" style=\"flex-direction: row; box-sizing: border-box; display: flex;\"><!----><div _ngcontent-vrj-c267=\"\" fxflex=\"0 1 816px\" class=\"component component-id-1e35712b-1134-420a-b523-bd885b74ceb1 component-index-4 component-with-name content-component\" style=\"flex: 0 1 816px; box-sizing: border-box; max-width: 816px;\"><!----><app-heading-component-name _ngcontent-vrj-c267=\"\" _nghost-vrj-c264=\"\"><h2 _ngcontent-vrj-c264=\"\" class=\"component-content-item app-name-view component-name ng-star-inserted\"> Required Instructional Materials\n</h2><!----><!----></app-heading-component-name><!----><span _ngcontent-vrj-c267=\"\" class=\"ng-star-inserted\"><!----></span><!----><!----><div _ngcontent-vrj-c267=\"\" class=\"component-body component-content-item app-body-view\"><!----><!----><app-heading-component-editor-content _ngcontent-vrj-c267=\"\" ngclass.gt-md=\"heading-component-editor-lg\" _nghost-vrj-c268=\"\" class=\"ng-star-inserted\"><app-form-editor _ngcontent-vrj-c268=\"\" _nghost-vrj-c304=\"\"><!----><div _ngcontent-vrj-c304=\"\" class=\"fr-view ng-star-inserted\" id=\"editor-0.5812915041682514\"><p id=\"isPasted\"><strong>Text&nbsp;</strong></p><p>Denney L. Wright, <em>Oil and Gas Tax: A Comprehensive Study</em>, Wolters Kluwer Aspen Select Series, 2019 Ed. (ISBN 9781543816112)&nbsp;</p><p>&nbsp;</p><p><strong>Other Text Resources (<em>supplements</em> to required text for <em>optional </em>reference)&nbsp;</strong></p><p>Wolters Kluwer Editorial Staff, <em>Oil and Gas: Federal Income Taxation</em>, Wolters Kluwer, 2025 Ed. (ISBN 9780808060529)&nbsp;</p><p>Robert Polevoi and William H. Byrnes, IV, <em>Federal Taxation of Oil and Gas Transactions</em>, Matthew Bender, (ISBN 9780820512808) (available in O'Quinn Law Library UHLC)&nbsp;</p><p><br></p></div><!----><!----></app-form-editor></app-heading-component-editor-content><!----><!----></div><div _ngcontent-vrj-c267=\"\" class=\"component-footer component-content-item\"></div></div><!----></div></app-heading-component-variation><!----><!----><!----><!----></div>",
            "locale": "en-US",
            "is_public": true,
            "signature": "ed2ccb96-0260-fa1d-275d-6f9f59cd464f",
            "sort_order": 3,
            "word_count": 78,
            "snapshot_id": "1acf5222-4856-4569-b31b-5e885778fc52",
            "component_id": "1e35712b-1134-420a-b523-bd885b74ceb1",
            "component_type": "content",
            "variation_status": "passed"
        },
        {
            "html": "<div _ngcontent-vrj-c262=\"\" class=\"component-wrapper test-class ng-star-inserted\" id=\"id_5dc86566-1ae5-444d-a80c-54c9400ea9d0_ca4b99ac-4a4f-461d-ac39-46187d569096\"><app-heading-component-variation _ngcontent-vrj-c262=\"\" _nghost-vrj-c267=\"\" class=\"ng-star-inserted\"><div _ngcontent-vrj-c267=\"\" fxlayout=\"\" inviewport=\"\" style=\"flex-direction: row; box-sizing: border-box; display: flex;\"><!----><div _ngcontent-vrj-c267=\"\" fxflex=\"0 1 816px\" class=\"component component-id-ca4b99ac-4a4f-461d-ac39-46187d569096 component-index-5 component-with-name content-component\" style=\"flex: 0 1 816px; box-sizing: border-box; max-width: 816px;\"><!----><app-heading-component-name _ngcontent-vrj-c267=\"\" _nghost-vrj-c264=\"\"><h2 _ngcontent-vrj-c264=\"\" class=\"component-content-item app-name-view component-name ng-star-inserted\"> Course Schedule, Assignments, and Assessments\n</h2><!----><!----></app-heading-component-name><!----><span _ngcontent-vrj-c267=\"\" class=\"ng-star-inserted\"><!----></span><!----><!----><div _ngcontent-vrj-c267=\"\" class=\"component-body component-content-item app-body-view\"><!----><!----><app-heading-component-editor-content _ngcontent-vrj-c267=\"\" ngclass.gt-md=\"heading-component-editor-lg\" _nghost-vrj-c268=\"\" class=\"ng-star-inserted\"><app-form-editor _ngcontent-vrj-c268=\"\" _nghost-vrj-c304=\"\"><!----><div _ngcontent-vrj-c304=\"\" class=\"fr-view ng-star-inserted\" id=\"editor-0.59128047732473\"><p id=\"isPasted\">Our class will be conducted face-to-face each week from 6 pm – 9 pm in MH 114 as well as on Zoom. Students must attend class in the mode in which they registered, although students registered for remote attendance will be welcome to attend class face-to-face in MH 114 (please let us know, however, so we can have copies of any materials available for all attending class in MH 114). Recordings of each class will be posted, if possible, in case of absence and/or for review. A full assignment sheet will be posted online on our Oil &amp; Gas Tax site on UH Canvas --the central communication tool for the class. The Wright Casebook will provide specific cases, rulings, statutory and regulatory references as well as problems on each topic and will serve as the primary discussion materials for each class. Supplemental readings will be posted from the Wolters Kluwers text should the student desire further details presented in a text format. The assignment sheet will be updated and posted to UH Canvas throughout the semester as needed. Students can also refer to the Polevoi text that is available in the O'Quinn Law Library at UHLC. These supplements provide additional insights on the topics covered in class and will provide a more detailed discussion should the student want more detail on a particular topic.&nbsp;</p><p>&nbsp;</p><p>Students should focus on cases, rulings, statutes, regulations, and other materials from the assigned pages in the Wright Casebook for each class. Each topic has problems which you should answer and submit for credit. You will be awarded up to 10 points on problems from each chapter, so the homework problems can earn up to 110 points in credit toward your final grade. A total of 210 points will be the highest point total / grade. Your exam will be weighted at 100 points and the problems at 110 points. You must submit your answers on our UH Canvas site before the start of class and these will be discussed in detail during each class. The date stamp on UH Canvas will control as to the date and time of submission of your answers. If a chapter is being covered over two class periods, the problems must be posted at the start of the second class. Answers to the problems in the Wright Casebook will be posted on our UH Canvas class site after the assignments have been turned in. Your answers will be judged based on providing reasonable responses so you can still earn some credit even if the answer is not completely correct. Note that you are NOT to use <em>any</em> form of Artificial Intelligence (AI) in class preparation, homework assignments and/or during the final examination.&nbsp;</p><p><br></p></div><!----><!----></app-form-editor></app-heading-component-editor-content><!----><!----></div><div _ngcontent-vrj-c267=\"\" class=\"component-footer component-content-item\"></div></div><!----></div></app-heading-component-variation><!----><!----><!----><!----></div>",
            "locale": "en-US",
            "is_public": true,
            "signature": "7a924a50-8b8a-6596-7544-65a7740a1661",
            "sort_order": 4,
            "word_count": 458,
            "snapshot_id": "1acf5222-4856-4569-b31b-5e885778fc52",
            "component_id": "ca4b99ac-4a4f-461d-ac39-46187d569096",
            "component_type": "content",
            "variation_status": "passed"
        },
        {
            "html": "<div _ngcontent-vrj-c262=\"\" class=\"component-wrapper test-class ng-star-inserted\" id=\"id_5dc86566-1ae5-444d-a80c-54c9400ea9d0_c2cbc3ef-2081-4a63-a675-c6c32b3e71a2\"><app-heading-component-variation _ngcontent-vrj-c262=\"\" _nghost-vrj-c267=\"\" class=\"ng-star-inserted\"><div _ngcontent-vrj-c267=\"\" fxlayout=\"\" inviewport=\"\" style=\"flex-direction: row; box-sizing: border-box; display: flex;\"><!----><div _ngcontent-vrj-c267=\"\" fxflex=\"0 1 816px\" class=\"component component-id-c2cbc3ef-2081-4a63-a675-c6c32b3e71a2 component-index-6 component-with-name content-component\" style=\"flex: 0 1 816px; box-sizing: border-box; max-width: 816px;\"><!----><app-heading-component-name _ngcontent-vrj-c267=\"\" _nghost-vrj-c264=\"\"><h2 _ngcontent-vrj-c264=\"\" class=\"component-content-item app-name-view component-name ng-star-inserted\"> Discussion and Lecture Topics\n</h2><!----><!----></app-heading-component-name><!----><span _ngcontent-vrj-c267=\"\" class=\"ng-star-inserted\"><!----></span><!----><!----><div _ngcontent-vrj-c267=\"\" class=\"component-body component-content-item app-body-view\"><!----><!----><app-heading-component-editor-content _ngcontent-vrj-c267=\"\" ngclass.gt-md=\"heading-component-editor-lg\" _nghost-vrj-c268=\"\" class=\"ng-star-inserted\"><app-form-editor _ngcontent-vrj-c268=\"\" _nghost-vrj-c304=\"\"><!----><div _ngcontent-vrj-c304=\"\" class=\"fr-view ng-star-inserted\" id=\"editor-0.3406262791884562\"><p>A full semester Assignment Sheet will be posted to our UH Canvas site that will highlight the topics to be covered during our class over the semester. &nbsp;</p></div><!----><!----></app-form-editor></app-heading-component-editor-content><!----><!----></div><div _ngcontent-vrj-c267=\"\" class=\"component-footer component-content-item\"></div></div><!----></div></app-heading-component-variation><!----><!----><!----><!----></div>",
            "locale": "en-US",
            "is_public": true,
            "signature": "eecd6d2a-7122-3ce7-5105-ca0a40ee38d9",
            "sort_order": 5,
            "word_count": 32,
            "snapshot_id": "1acf5222-4856-4569-b31b-5e885778fc52",
            "component_id": "c2cbc3ef-2081-4a63-a675-c6c32b3e71a2",
            "component_type": "content",
            "variation_status": "passed"
        },
        {
            "html": "<div _ngcontent-vrj-c262=\"\" class=\"component-wrapper test-class ng-star-inserted\" id=\"id_5dc86566-1ae5-444d-a80c-54c9400ea9d0_097db850-c8a9-45bc-9ecc-64f92d0eecc6\"><app-heading-component-variation _ngcontent-vrj-c262=\"\" _nghost-vrj-c267=\"\" class=\"ng-star-inserted\"><div _ngcontent-vrj-c267=\"\" fxlayout=\"\" inviewport=\"\" style=\"flex-direction: row; box-sizing: border-box; display: flex;\"><!----><div _ngcontent-vrj-c267=\"\" fxflex=\"0 1 816px\" class=\"component component-id-097db850-c8a9-45bc-9ecc-64f92d0eecc6 component-index-7 component-with-name content-component\" style=\"flex: 0 1 816px; box-sizing: border-box; max-width: 816px;\"><!----><app-heading-component-name _ngcontent-vrj-c267=\"\" _nghost-vrj-c264=\"\"><h2 _ngcontent-vrj-c264=\"\" class=\"component-content-item app-name-view component-name ng-star-inserted\"> Grading Rubrics and Weights\n</h2><!----><!----></app-heading-component-name><!----><span _ngcontent-vrj-c267=\"\" class=\"ng-star-inserted\"><!----></span><!----><!----><div _ngcontent-vrj-c267=\"\" class=\"component-body component-content-item app-body-view\"><!----><!----><app-heading-component-editor-content _ngcontent-vrj-c267=\"\" ngclass.gt-md=\"heading-component-editor-lg\" _nghost-vrj-c268=\"\" class=\"ng-star-inserted\"><app-form-editor _ngcontent-vrj-c268=\"\" _nghost-vrj-c304=\"\"><!----><div _ngcontent-vrj-c304=\"\" class=\"fr-view ng-star-inserted\" id=\"editor-0.5304947233007644\"><p>A two-hour final examination will be administered to determine part of your class grade. Whether an online exam or an in classroom, proctored exam, the exam will consist of multiple problems -- short answer questions counting for approximately 30% of the grade, essay/computational questions--generally one- or two-page essays or computational problems--counting for approximately 50% of the grade and true/false questions counting for approximately 20% of the grade. The exam will be closed book/closed notes. Your computer will be in “closed” mode during the exam. Calculators will be allowed for computational questions. You are responsible for anything covered in class as well as any assigned reading materials. Note that the exam will be offered face-to-face although students enrolled 100% remotely will have a remote exam offering. &nbsp; We will likely utilize the CASA Testing Center on UH Campus to administer our in person and/or remote exam as we have done in past semesters. &nbsp;Full details of administration of the exam will be announced later in the semester.&nbsp;</p></div><!----><!----></app-form-editor></app-heading-component-editor-content><!----><!----></div><div _ngcontent-vrj-c267=\"\" class=\"component-footer component-content-item\"></div></div><!----></div></app-heading-component-variation><!----><!----><!----><!----></div>",
            "locale": "en-US",
            "is_public": true,
            "signature": "654e2938-86d1-de76-8523-34c218e449df",
            "sort_order": 6,
            "word_count": 170,
            "snapshot_id": "1acf5222-4856-4569-b31b-5e885778fc52",
            "component_id": "097db850-c8a9-45bc-9ecc-64f92d0eecc6",
            "component_type": "content",
            "variation_status": "passed"
        },
        {
            "html": "<div _ngcontent-vrj-c262=\"\" class=\"component-wrapper test-class ng-star-inserted\" id=\"id_5dc86566-1ae5-444d-a80c-54c9400ea9d0_826f6fa7-ca8b-48aa-b166-6ecfea63a07f\"><app-heading-component-variation _ngcontent-vrj-c262=\"\" _nghost-vrj-c267=\"\" class=\"ng-star-inserted\"><div _ngcontent-vrj-c267=\"\" fxlayout=\"\" inviewport=\"\" style=\"flex-direction: row; box-sizing: border-box; display: flex;\"><!----><div _ngcontent-vrj-c267=\"\" fxflex=\"0 1 816px\" class=\"component component-id-826f6fa7-ca8b-48aa-b166-6ecfea63a07f component-index-8 component-with-name content-component\" style=\"flex: 0 1 816px; box-sizing: border-box; max-width: 816px;\"><!----><app-heading-component-name _ngcontent-vrj-c267=\"\" _nghost-vrj-c264=\"\"><h2 _ngcontent-vrj-c264=\"\" class=\"component-content-item app-name-view component-name ng-star-inserted\"> Course Policies and Procedures\n</h2><!----><!----></app-heading-component-name><!----><span _ngcontent-vrj-c267=\"\" class=\"ng-star-inserted\"><!----></span><!----><!----><div _ngcontent-vrj-c267=\"\" class=\"component-body component-content-item app-body-view\"><!----><!----><app-heading-component-editor-content _ngcontent-vrj-c267=\"\" ngclass.gt-md=\"heading-component-editor-lg\" _nghost-vrj-c268=\"\" class=\"ng-star-inserted\"><app-form-editor _ngcontent-vrj-c268=\"\" _nghost-vrj-c304=\"\"><!----><div _ngcontent-vrj-c304=\"\" class=\"fr-view ng-star-inserted\" id=\"editor-0.9369322355622245\"><p>Class will be conducted utilizing a mixture of lecture and random recitation on the cases, problems, and other assigned materials. Active participation will be expected by all students. If you are not prepared for class, please let me know in advance, but class attendance is strongly recommended whether prepared or not prepared. Active participation in classroom discussion may be reflected positively in your final grade -- excessive lack of preparation or absences may be reflected negatively in your final grade.</p><p>As previously stated, note that you are NOT to use <em>any</em> form of Artificial Intelligence (AI) in class preparation, homework assignments and/or during the final examination.&nbsp;</p><p>Please fill out a student information sheet (posted online on our UH Oil &amp; Gas Tax Canvas class site) and submit to Professor Wright as soon as possible. &nbsp;The information requested includes your name, undergraduate course of study, current/past relevant experience in oil and gas, tax background (if any) and current (or past) employment if relevant. &nbsp;This information will enhance communications and will provide background information which should be helpful in focusing class discussion.&nbsp;</p></div><!----><!----></app-form-editor></app-heading-component-editor-content><!----><!----></div><div _ngcontent-vrj-c267=\"\" class=\"component-footer component-content-item\"></div></div><!----></div></app-heading-component-variation><!----><!----><!----><!----></div>",
            "locale": "en-US",
            "is_public": true,
            "signature": "70d47146-0899-8c0e-bb7a-1c1d0955f577",
            "sort_order": 7,
            "word_count": 184,
            "snapshot_id": "1acf5222-4856-4569-b31b-5e885778fc52",
            "component_id": "826f6fa7-ca8b-48aa-b166-6ecfea63a07f",
            "component_type": "content",
            "variation_status": "passed"
        },
        {
            "html": "<div _ngcontent-vrj-c262=\"\" class=\"component-wrapper test-class ng-star-inserted\" id=\"id_5dc86566-1ae5-444d-a80c-54c9400ea9d0_4a8af1fa-4db6-4ba0-95f4-a25b79689c5a\"><app-heading-component-variation _ngcontent-vrj-c262=\"\" _nghost-vrj-c267=\"\" class=\"ng-star-inserted\"><div _ngcontent-vrj-c267=\"\" fxlayout=\"\" inviewport=\"\" style=\"flex-direction: row; box-sizing: border-box; display: flex;\"><!----><div _ngcontent-vrj-c267=\"\" fxflex=\"0 1 816px\" class=\"component component-id-4a8af1fa-4db6-4ba0-95f4-a25b79689c5a component-index-10 component-with-name content-component\" style=\"flex: 0 1 816px; box-sizing: border-box; max-width: 816px;\"><!----><app-heading-component-name _ngcontent-vrj-c267=\"\" _nghost-vrj-c264=\"\"><h2 _ngcontent-vrj-c264=\"\" class=\"component-content-item app-name-view component-name ng-star-inserted\"> University Policies and Student Support Resources\n</h2><!----><!----></app-heading-component-name><!----><span _ngcontent-vrj-c267=\"\" class=\"ng-star-inserted\"><!----></span><!----><!----><div _ngcontent-vrj-c267=\"\" class=\"component-body component-content-item app-body-view\"><!----><!----><app-heading-component-editor-content _ngcontent-vrj-c267=\"\" ngclass.gt-md=\"heading-component-editor-lg\" _nghost-vrj-c268=\"\" class=\"ng-star-inserted\"><app-form-editor _ngcontent-vrj-c268=\"\" _nghost-vrj-c304=\"\"><!----><div _ngcontent-vrj-c304=\"\" class=\"fr-view ng-star-inserted\" id=\"editor-0.5739630437369896\"><h3 id=\"isPasted\"><strong>Mental Health and Wellness Resources</strong></h3><p>The University of Houston has a number of resources to support students’ mental health and overall wellness, including <a href=\"https://uh.edu/coogs-care/\" rel=\"noopener noreferrer\" target=\"_blank\">CoogsCARE</a> and the <a href=\"https://uh.edu/go/\" rel=\"noopener noreferrer\" target=\"_blank\">UH Go App</a>. <a href=\"https://uh.edu/caps/services/\" rel=\"noopener noreferrer\" target=\"_blank\">UH Counseling and Psychological Services (CAPS)</a> offers 24/7 mental health support for all students, addressing various concerns like stress, college adjustment and sadness. CAPS provides individual and couples counseling, group therapy, workshops and connections to other support services on and off- campus. For assistance visit <a href=\"//uh.edu/caps\">uh.edu/caps</a>, call 713-743-5454, or visit a <a href=\"https://www.uh.edu/caps/outreach/lets-talk/\" rel=\"noopener noreferrer\" target=\"_blank\">Let’s Talk</a> location in-person or virtually. Let’s Talk are daily, informal confidential consultations with CAPS therapists where no appointment or paperwork is needed.</p><p><strong>Need Support Now? If you or someone you know is struggling or in crisis, help is available. Call CAPS crisis support 24/7 at 713-743-5454, or the National Suicide and Crisis Lifeline: call or text 988, or chat <a href=\"//988lifeline.org\" rel=\"noopener noreferrer\" target=\"_blank\">988lifeline.org</a>.</strong></p><h3><strong>Title IX/Sexual Misconduct</strong></h3><p id=\"isPasted\">Per the UHS Sexual Misconduct Policy, your instructor is a “responsible employee” for reporting purposes under Title IX regulations and state law and must report incidents of sexual misconduct (sexual harassment, non-consensual sexual contact, sexual assault, sexual exploitation, sexual intimidation, intimate partner violence, or stalking) about which they become aware to the Title IX office (known at UH as the Equal Opportunity Services office or \"EOS\"). Please know there are places on campus where you can make a report in confidence. You can find more information about resources on the UH <a href=\"https://uh.edu/equal-opportunity/title-ix-sexual-misconduct/resources/\" rel=\"noopener noreferrer\" target=\"_blank\">Title IX/Sexual Misconduct Resources page</a>. Please note that you may also report concerns of discrimination based on your protected class identity to EOS.</p><h3><strong>Reasonable Academic Adjustments/Auxiliary Aids</strong></h3><p>The University of Houston is committed to providing an academic environment and educational programs that are accessible for its students. Any student with a disability who is experiencing barriers to learning, assessment or participation is encouraged to contact the Justin Dart, Jr. Student Accessibility Center (Dart Center) to learn more about academic accommodations and support that may be available to them. Students seeking academic accommodations will need to register with the Dart Center as soon as possible to ensure timely implementation of approved accommodations. Please contact the Dart Center by visiting the website: https://uh.edu/accessibility/ calling (713) 743-5400, or emailing <a href=\"mailto:jdcenter@Central.UH.EDU\">jdcenter@Central.UH.EDU</a>.</p><p>The <a href=\"https://uh.edu/healthcenter/services/medical-services/psychiatry-clinic/\" rel=\"noopener noreferrer\" target=\"_blank\">Student Health Center</a> offers a Psychiatry Clinic for enrolled UH students. Call 713-743-5149 during clinic hours, Monday through Friday 8 a.m. - 4:30 p.m. to schedule an appointment.</p><p>The <a href=\"https://www.uh.edu/adbruce/\" rel=\"noopener noreferrer\" target=\"_blank\">A.D. Bruce Religion Center</a> offers spiritual support and a variety of programs centered on well-being.</p><p>The <a href=\"https://uh.edu/csac/cougar-cupboard/\" rel=\"noopener noreferrer\" target=\"_blank\">Center for Student Advocacy and Community (CSAC)</a> is where you can go if you need help but don’t know where to start. CSAC is a “home away from home” and serves as a <a href=\"https://uh.edu/csac/resources/\" rel=\"noopener noreferrer\" target=\"_blank\">resource hub</a> to help you get the resources needed to support academic and personal success. Through our <a href=\"https://uh.edu/csac/cougar-cupboard/\" rel=\"noopener noreferrer\" target=\"_blank\">Cougar Cupboard</a>, all students can get up to 30 lbs of FREE groceries a week. Additionally, we provide 1:1 appointments to get you connected to on- and off-campus resources related to essential needs, safety and advocacy, and more. The <a href=\"https://www.instagram.com/cougarcloset/\" rel=\"noopener noreferrer\" target=\"_blank\">Cougar Closet</a> is a registered student organization advised by our office and offers free clothes to students so that all Coogs can feel good in their fit. We also host a series of cultural and community-based events that fosters social connection and helps the cougar community come closer together. Visit the CSAC homepage or follow us on Instagram: @uh_CSAC and @uhcupbrd. YOU belong here.</p><h3><strong>Women and Gender Resource Center</strong></h3><p>The mission of the <a href=\"https://uh.edu/wgrc/\" rel=\"noopener noreferrer\" target=\"_blank\">WGRC</a> is to advance the University of Houston and promote the success of all students, faculty, and staff through educating, empowering, and supporting the UH community. The WGRC suite is open to you. Stop by the office for a study space, to take a break, grab a snack, or check out one of the WGRC programs or resources. Stop by Student Center South room B12 (Basement floor near Starbucks and down the hall from Creation Station) from 9 am to 5 pm Monday through Friday.</p><h3><strong>Academic Honesty Policy</strong></h3><p>High ethical standards are critical to the integrity of any institution, and bear directly on the ultimate value of conferred degrees. All UH community members are expected to contribute to an atmosphere of the highest possible ethical standards. Maintaining such an atmosphere requires that any instances of academic dishonesty be recognized and addressed. The <a href=\"https://uh.edu/provost/students/student-policies/honesty/index\" rel=\"noopener noreferrer\" target=\"_blank\">UH Academic Honesty Policy</a> is designed to handle those instances with fairness to all parties involved: the students, the instructors, and the University itself. All students and faculty of the University of Houston are responsible for being familiar with this policy.</p><h3><strong>Excused Absence Policy</strong></h3><p>Regular class attendance, participation, and engagement in coursework are important contributors to student success. Absences may be excused as provided in the University of Houston <a href=\"https://www.uh.edu/provost/students/student-policies/excused-absence-policy/\" rel=\"noopener noreferrer\" target=\"_blank\">Undergraduate Excused Absence Policy</a> and <a href=\"https://www.uh.edu/provost/students/student-policies/excused-absence-policy/\" rel=\"noopener noreferrer\" target=\"_blank\">Graduate Excused Absence Policy</a> for reasons including medical illness of student or close relative, death of a close family member, legal or government proceeding that a student is obligated to attend, recognized professional and educational activities where the student is presenting, and University-sponsored activity or athletic competition. Under these policies, students with excused absences will be provided with an opportunity to make up any quiz, exam or other work that contributes to the course grade or a satisfactory alternative. Please read the full policy for details regarding reasons for excused absences, the approval process, and extended absences. Additional policies address absences related to <a href=\"https://publications.uh.edu/content.php?catoid=49&amp;navoid=18634\" rel=\"noopener noreferrer\" target=\"_blank\">military service</a>, <a href=\"https://www.uh.edu/provost/students/student-policies/religious-holy-days/\" rel=\"noopener noreferrer\" target=\"_blank\">religious holy days</a>, <a href=\"https://www.uh.edu/wgrc/parenting-students/\" rel=\"noopener noreferrer\" target=\"_blank\">pregnancy and related conditions</a>, and <a href=\"http://mpliance-ethics/_docs/sam/01/1d9.pdf\" rel=\"noopener noreferrer\" target=\"_blank\">disability</a>.</p><h3><strong>Recording of Class</strong></h3><p>Students may not record all or part of class, livestream all or part of class, or make/distribute screen captures, without advanced written consent of the instructor. If you have or think you may have a disability such that you need to record class-related activities, please contact the <a href=\"https://uh.edu/accessibility/\" rel=\"noopener noreferrer\" target=\"_blank\">Justin Dart, Jr. Student Accessibility Center</a>. If you have an accommodation to record class-related activities, those recordings may not be shared with any other student, whether in this course or not, or with any other person or on any other platform. Classes may be recorded by the instructor. Students may use instructor’s recordings for their own studying and notetaking. Instructor’s recordings are not authorized to be shared with anyone without the prior written approval of the instructor. Failure to comply with requirements regarding recordings will result in a disciplinary referral to the Dean of Students Office and may result in disciplinary action.</p></div><!----><!----></app-form-editor></app-heading-component-editor-content><!----><!----></div><div _ngcontent-vrj-c267=\"\" class=\"component-footer component-content-item\"></div></div><!----></div></app-heading-component-variation><!----><!----><!----><!----></div>",
            "locale": "en-US",
            "is_public": true,
            "signature": "8179ad93-d72b-ef12-8459-aeca8ba7d91d",
            "sort_order": 8,
            "word_count": 1069,
            "snapshot_id": "1acf5222-4856-4569-b31b-5e885778fc52",
            "component_id": "4a8af1fa-4db6-4ba0-95f4-a25b79689c5a",
            "component_type": "content",
            "variation_status": "passed"
        }
        ],
        "properties": {
        "ca_2": "Prerequisite(s): Graduate standing. This course examines the fundamental property concepts governing oil and gas taxation.  Topics include geological and geophysical costs, intangible drilling costs, equipment costs, dry hole costs, and abandonment.",
        "ca_3": "Face-to-Face",
        "ca_8": "Mo 06:00 PM-09:00 PM",
        "ca_9": "H_20253_ACCT_7337_17848",
        "name": "17848",
        "ca_10": "University of Houston; Leroy and Lucile Melcher Hall; MH 114",
        "title": "Oil & Gas Taxation",
        "created": "2025-03-13T20:19:52.192105",
        "term_id": "c80f252f-a903-4859-a225-6473131c9fb0",
        "modified": "2025-03-13T20:19:52.192105",
        "timezone": "US/Central",
        "entity_id": "286ce48f-acde-4ca9-b6bc-246f9c102e71",
        "full_name": "ACCT 7337 - Oil & Gas Taxation",
        "is_active": true,
        "parent_id": "de02757d-d64a-4cdc-b02d-541e8f5f2b0d",
        "entity_type": "course",
        "subject_name": "ACCT",
        "course_number": "7337",
        "is_self_active": true,
        "is_parent_active": true,
        "syllabus_due_date": null
        },
        "is_editable": true,
        "is_missing_required_content": false,
        "engagement": {
        "engaged_count": 0,
        "student_count": 0
        },
        "uploads": [],
        "history": null,
        "last_edited_date": "2025-05-06T11:32:15.173999-05:00",
        "ancestry_ids": [
        "286ce48f-acde-4ca9-b6bc-246f9c102e71",
        "c80f252f-a903-4859-a225-6473131c9fb0",
        "ae5069b5-c769-4be7-882c-b52071330b12",
        "de02757d-d64a-4cdc-b02d-541e8f5f2b0d",
        "f79b4df2-1823-4595-a78c-1738d07f5029",
        "412a6bd2-9e18-4d3f-b97c-b2310ded6b0a"
        ]
    },
    "step_numbers": [
        {
        "account_id": "a68b9805-37ba-4149-b303-c990ff3b647e",
        "step_number": 0
        }
    ],
    "has_approver_edits": null,
    "can_edit_visibility": false
    }
 */
export type SSFullDocument = z.infer<typeof SSFullDocument>
export const SSFullDocument = z.object({
    doc_data: z.object({
        code: z.string(), // "megwtcr68"
        title: z.string(), // "ACCT 7337 17848"
        subtitle: z.string(), // "Oil & Gas Taxation"
        created: z.iso.datetime(), // "2025-03-30T22:50:37.475535-05:00"
        modified: z.iso.datetime(), // "2025-06-19T03:40:54.214269-05:00"
    })
})


/**
 * https://uh.simplesyllabus.com/api2/doc-library-search?search=ACCT%207337&term_statuses%5B%5D=future&term_statuses%5B%5D=current
 */
export type SSSearchResponse = Awaited<ReturnType<typeof search>>;
export async function search(filter: string) {
    const schema = SSResponseWrapper(SSSearchResult);
    let query = new URLSearchParams([
        ['search', filter],
        ['term_statuses[]', 'future'],
        ['term_statuses[]', 'current'],
        ['term_statuses[]', 'historic']
    ]);
    query.append('term_statuses[]', 'future');
    query.append('term_statuses[]', 'current');
    query.append('term_statuses[]', 'historic');
    const res = await fetch(`https://uh.simplesyllabus.com/api2/doc-library-search?${query}`, {
        headers: {
            'Origin': 'https://cougargrades.io' // For now, we want to be neighborly...
        }
    });
    const data = await res.json();
    const parsed = await schema.safeParseAsync(data)
    if (parsed.success) {
        return parsed.data
    }
    else {
        return null;
    }
}

/**
 * https://uh.simplesyllabus.com/api2/doc-full-page-get?code=megwtcr68
 */
export type SSFullDocumentResponse = Awaited<ReturnType<typeof getDocumentMetadata>>;
export async function getDocumentMetadata(docCode: string) {
    const schema = SSResponseWrapper(SSFullDocument);
    let query = new URLSearchParams({
        code: docCode
    })
    const res = await fetch(`https://uh.simplesyllabus.com/api2/doc-full-page-get?${query}`)
    const data = await res.json();
    const parsed = await schema.safeParseAsync(data);
    if (parsed.success) {
        return parsed.data
    }
    else {
        return null;
    }
}

