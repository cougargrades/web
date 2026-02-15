
import { is } from '@cougargrades/utils/zod'
import { trimStart } from 'lodash-es'
import { DocumentReference } from './DocumentReference';
import { Section } from './Section';
import { Course } from './Course';
import { Instructor } from './Instructor';

export function ToQueryKeys(input: DocumentReference | Course | Instructor | Section): string[] {
  // DocumentReferences already have paths defined
  if (is(input, DocumentReference)) {
    // Prevent: `/foo/bar` => ['', 'foo', 'bar']
    // We want: `/foo/bar` => ['foo', 'bar']
    return trimStart(input.pathname, '/').split('/');
  }
  // Courses
  else if (is(input, Course)) {
    return trimStart(input._path, '/').split('/');
  }
  // Instructors
  else if (is(input, Instructor)) {
    return trimStart(input._path, '/').split('/');
  }
  // Sections
  else if (is(input, Section)) {
    return trimStart(input._path, '/').split('/');
  }
  // Shouldn't happen
  else {
    return []
  }
}
