/**
 * Study scripts
 */

function getHash(str){
  let hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash >>> 0;
}


/**
 * Update studentAssignment
 * @param {org.ogma.academic.transaction.UpdateStudentAssignment} tx
 * @transaction
 */

async function updateStudentAssignment(tx) {
  const studentAssignmentRegistry = await getAssetRegistry('org.ogma.academic.StudentAssignment');

  tx.studentAssignment.grade 		        = tx.grade;
  tx.studentAssignment.passed 		        = tx.passed;
  tx.studentAssignment.additionalFiles 		= tx.additionalFiles;

  await studentAssignmentRegistry.update(tx.studentAssignment);
}

/**
 * Create studentAssignment
 * @param {org.ogma.academic.transaction.CreateStudentAssignment} tx
 * @transaction
 */

async function createStudentAssignment(tx) {
  const studentAssignmentRegistry = await getAssetRegistry('org.ogma.academic.StudentAssignment');

  const factory = getFactory();

  const studentAssignmentId = getHash(tx.student.studentId + tx.assignment.assignmentId + tx.grade);

  let studentAssignment = factory.newResource('org.ogma.academic', 'StudentAssignment', studentAssignmentId.toString());

  studentAssignment.grade 		          	= tx.grade;
  studentAssignment.passed 		          	= tx.passed;
  studentAssignment.additionalFiles 		= tx.additionalFiles;
  
  studentAssignment.student 		        = tx.student;
  studentAssignment.assignment 			    = tx.assignment;

  await studentAssignmentRegistry.add(studentAssignment);
}

/**
 * Update studentCourse
 * @param {org.ogma.academic.transaction.UpdateStudentCourse} tx
 * @transaction
 */

async function updateStudentCourse(tx) {
  const studentCourseRegistry = await getAssetRegistry('org.ogma.academic.StudentCourse');

  tx.studentCourse.finalGrade = tx.finalGrade;

  await studentCourseRegistry.update(tx.studentCourse);
}

/**
 * Create studentCourse
 * @param {org.ogma.academic.transaction.CreateStudentCourse} tx
 * @transaction
 */

async function createStudentCourse(tx) {
  const studentCourseRegistry = await getAssetRegistry('org.ogma.academic.StudentCourse');

  const factory = getFactory();

  const studentCourseId = getHash(tx.student.studentId + tx.course.courseId + tx.course.professor.professorId);

  let studentCourse = factory.newResource('org.ogma.academic', 'StudentCourse', studentCourseId.toString());

  studentCourse.student 		= tx.student;
  studentCourse.course 			= tx.course;

  await studentCourseRegistry.add(studentCourse);
}

/**
 * Update assignment
 * @param {org.ogma.academic.transaction.UpdateAssignment} tx
 * @transaction
 */

async function updateAssignment(tx) {
  const courseRegistry = await getAssetRegistry('org.ogma.academic.Assignment');
  
  tx.assignment.name 						    = tx.name;
  tx.assignment.gradeRequired         			= tx.gradeRequired;

  await courseRegistry.update(tx.assignment);
}

/**
 * Create assignment
 * @param {org.ogma.academic.transaction.CreateAssignment} tx
 * @transaction
 */

async function createAssignment(tx) {
  const assignmentRegistry = await getAssetRegistry('org.ogma.academic.Assignment');

  const factory = getFactory();

  const assignmentId = getHash(tx.name + tx.startDate + tx.course.professor.professorId + tx.course.courseId);

  let assignment = factory.newResource('org.ogma.academic', 'Assignment', assignmentId.toString());

  assignment.name 						    	= tx.name;
  assignment.gradeRequired         				= tx.gradeRequired;
  assignment.course 						    = tx.course;

  await assignmentRegistry.add(assignment);
}


/**
 * Update course
 * @param {org.ogma.academic.transaction.UpdateCourse} tx
 * @transaction
 */

async function updateCourse(tx){
  const courseRegistry = await getAssetRegistry('org.ogma.academic.Course');

  tx.course.name 						    		= tx.name;
  tx.course.startDate 					          	= tx.startDate;
  tx.course.credits 						   	 	= tx.credits;

  await courseRegistry.update(tx.course);
}

/**
 * Create course
 * @param {org.ogma.academic.transaction.CreateCourse} tx
 * @transaction
 */

async function createCourse(tx) {
  const courseRegistry = await getAssetRegistry('org.ogma.academic.Course');
  const factory = getFactory();

  const courseId = getHash(tx.name + tx.startDate + tx.professor.professorId + tx.credits);
  let course = factory.newResource('org.ogma.academic', 'Course', courseId.toString());

  course.name 						    			= tx.name;
  course.startDate 					          		= tx.startDate;
  course.credits 						    		= tx.credits;
  course.professor 									= tx.professor;

  await courseRegistry.add(course);
}


/**
 * Update student
 * @param {org.ogma.academic.transaction.UpdateStudent} tx
 * @transaction
 */

async function updateStudent(tx){
  const studentRegistry = await getAssetRegistry('org.ogma.academic.Student');

  tx.student.firstName 						      	= tx.firstName;
  tx.student.lastName 					          	= tx.lastName;
  tx.student.birthDate 						      	= tx.birthDate;
  tx.student.enrollmentDate 						= tx.enrollmentDate;
  tx.student.photo 						      		= tx.photo;
  tx.student.group 						      		= tx.group;

  tx.student.phone 						          	= tx.phone;
  tx.student.email 						          	= tx.email;

  tx.student.address.address1 						= tx.address1;
  tx.student.address.address2 						= tx.address2;
  tx.student.address.state 							= tx.state;
  tx.student.address.city 							= tx.city;
  tx.student.address.countryCode 					= tx.countryCode;
  tx.student.address.zip 							= tx.zip;

  await studentRegistry.update(tx.student);
}

/**
 * Create student
 * @param {org.ogma.academic.transaction.CreateStudent} tx
 * @transaction
 */

async function createStudent(tx) {
  const studentRegistry = await getAssetRegistry('org.ogma.academic.Student');

  const factory = getFactory();

  const studentId = getHash(tx.firstName + tx.lastName + tx.email + tx.address1 + tx.countryCode);

  let student 									= factory.newResource('org.ogma.academic', 'Student', studentId.toString());
  let address 									= factory.newConcept('org.ogma.concept', 'Address');

  student.firstName 						    = tx.firstName;
  student.lastName 					          	= tx.lastName;
  student.birthDate 						    = tx.birthDate;
  student.enrollmentDate 						= tx.enrollmentDate;
  student.photo 						      	= tx.photo;
  student.group 						      	= tx.group;

  student.phone 						        = tx.phone;
  student.email 						        = tx.email;

  student.department                  			= tx.department;

  address.address1 							    = tx.address1;
  address.address2 							    = tx.address2;
  address.state 							    = tx.state;
  address.city 								    = tx.city;
  address.countryCode 						    = tx.countryCode;
  address.zip 								    = tx.zip;

  student.address = address;

  await studentRegistry.add(student);
}


/**
 * Update professor
 * @param {org.ogma.participant.transaction.UpdateProfessor} tx
 * @transaction
 */

async function updateProfessor(tx){
  const professorRegistry = await getParticipantRegistry('org.ogma.participant.Professor');

  tx.professor.firstName 						= tx.firstName;
  tx.professor.lastName 					    = tx.lastName;
  tx.professor.birthDate 						= tx.birthDate;
  tx.professor.photo							= tx.photo;

  tx.professor.phone 						    = tx.phone;
  tx.professor.email 						    = tx.email;

  tx.professor.address.address1 			  	= tx.address1;
  tx.professor.address.address2 			  	= tx.address2;
  tx.professor.address.state 					= tx.state;
  tx.professor.address.city 					= tx.city;
  tx.professor.address.countryCode 				= tx.countryCode;
  tx.professor.address.zip 						= tx.zip;

  await professorRegistry.update(tx.professor);
}

/**
 * Create professor
 * @param {org.ogma.participant.transaction.CreateProfessor} tx
 * @transaction
 */

async function createProfessor(tx){
  const professorRegistry = await getParticipantRegistry('org.ogma.participant.Professor');

  const factory = getFactory();

  const professorId = getHash(tx.firstName + tx.lastName + tx.email + tx.address1 + tx.countryCode);

  let professor 	= factory.newResource('org.ogma.participant', 'Professor', professorId.toString());
  let address 		= factory.newConcept('org.ogma.concept', 'Address');

  professor.firstName 						    = tx.firstName;
  professor.lastName 					        = tx.lastName;
  professor.birthDate 						    = tx.birthDate;
  professor.photo 						    	= tx.photo;

  professor.phone 						        = tx.phone;
  professor.email 						        = tx.email;

  professor.university                  		= tx.university;

  address.address1 							    = tx.address1;
  address.address2 							    = tx.address2;
  address.state 							    = tx.state;
  address.city 								    = tx.city;
  address.countryCode 						    = tx.countryCode;
  address.zip 								    = tx.zip;

  professor.address 							= address;

  await professorRegistry.add(professor);
}

/**
 * Update department
 * @param {org.ogma.participant.transaction.UpdateDepartment} tx
 * @transaction
 */

async function updateDepartment(tx){
  const departmentRegistry = await getParticipantRegistry('org.ogma.participant.Department');

  tx.department.name 						    = tx.name;
  tx.department.phone 						    = tx.phone;
  tx.department.logo 						    = tx.logo;
  tx.department.email 						    = tx.email;
  tx.department.openingDate 					= tx.openingDate;
  tx.department.websiteUrl 					    = tx.websiteUrl;
  tx.department.headFirstName				    = tx.headFirstName;
  tx.department.headLastName				    = tx.headLastName;
  tx.department.managerFirstName				= tx.managerFirstName;
  tx.department.managerLastName				    = tx.managerLastName;

  tx.department.address.address1 				= tx.address1;
  tx.department.address.address2 				= tx.address2;
  tx.department.address.state 					= tx.state;
  tx.department.address.city 					= tx.city;
  tx.department.address.countryCode 			= tx.countryCode;
  tx.department.address.zip 					= tx.zip;

  await departmentRegistry.update(tx.department);
}

/**
 * Create department
 * @param {org.ogma.participant.transaction.CreateDepartment} tx
 * @transaction
 */

async function createDepartment(tx){
  const departmentRegistry = await getParticipantRegistry('org.ogma.participant.Department');

  const factory = getFactory();

  const departmentId = getHash(tx.name + tx.email + tx.countryCode + tx.address1 + tx.state + tx.city);

  let department 	= factory.newResource('org.ogma.participant', 'Department', departmentId.toString());
  let address 		= factory.newConcept('org.ogma.concept', 'Address');

  department.name 						        = tx.name;
  department.phone 						        = tx.phone;
  department.logo 						        = tx.logo;
  department.email 						        = tx.email;
  department.openingDate 						= tx.openingDate;
  department.websiteUrl 					    = tx.websiteUrl;
  department.headFirstName				      	= tx.headFirstName;
  department.headLastName				        = tx.headLastName;
  department.managerFirstName				    = tx.managerFirstName;
  department.managerLastName				    = tx.managerLastName;


  department.university                 		= tx.university;

  address.address1 							    = tx.address1;
  address.address2 							    = tx.address2;
  address.state 							    = tx.state;
  address.city 								    = tx.city;
  address.countryCode 						    = tx.countryCode;
  address.zip 								    = tx.zip;

  department.address = address;

  await departmentRegistry.add(department);
}


/**
 * Update university
 * @param {org.ogma.participant.transaction.UpdateUniversity} tx
 * @transaction
 */

async function updateUniversity(tx){
  const universityRegistry = await getParticipantRegistry('org.ogma.participant.University');

  tx.university.name 						    = tx.name;
  tx.university.phone 						    = tx.phone;
  tx.university.logo 						   	= tx.logo;
  tx.university.email 						   	= tx.email;
  tx.university.openingDate 				 	= tx.openingDate;
  tx.university.websiteUrl 					    = tx.websiteUrl;
  tx.university.headFirstName				    = tx.headFirstName;
  tx.university.headLastName				    = tx.headLastName;
  tx.university.managerFirstName				= tx.managerFirstName;
  tx.university.managerLastName				  	= tx.managerLastName;

  tx.university.address.address1 			  	= tx.address1;
  tx.university.address.address2 			  	= tx.address2;
  tx.university.address.state 				  	= tx.state;
  tx.university.address.city				    = tx.city;
  tx.university.address.countryCode 			= tx.countryCode;
  tx.university.address.zip 				    = tx.zip;

  await universityRegistry.update(tx.university);
}

/**
 * Create university
 * @param {org.ogma.participant.transaction.CreateUniversity} tx
 * @transaction
 */

async function createUniversity(tx){
  const universityRegistry = await getParticipantRegistry('org.ogma.participant.University');

  const factory = getFactory();

  const universityId = getHash(tx.name + tx.email + tx.countryCode + tx.address1 + tx.state + tx. city);

  let university 	= factory.newResource('org.ogma.participant', 'University', universityId.toString());
  let address 		= factory.newConcept('org.ogma.concept', 'Address');

  university.name 							 	= tx.name;
  university.phone 							  	= tx.phone;
  university.email 							  	= tx.email;
  university.ministry 							= tx.ministry;
  university.websiteUrl 						= tx.websiteUrl;
  university.logo 							  	= tx.logo;
  university.openingDate						= tx.openingDate;
  university.headFirstName						= tx.headFirstName;
  university.headLastName						= tx.headLastName;
  university.managerFirstName					= tx.managerFirstName;
  university.managerLastName					= tx.managerLastName;

  address.address1 							  	= tx.address1;
  address.address2 							  	= tx.address2;
  address.state 							    = tx.state;
  address.city 								    = tx.city;
  address.countryCode 							= tx.countryCode;
  address.zip 								    = tx.zip;

  university.address = address;

  await universityRegistry.add(university);
}

/**
 * Create ministry
 * @param {org.ogma.participant.transaction.CreateMinistry} tx
 * @transaction
 */
async function createMinistry(tx){
  const ministryRegistry = await getParticipantRegistry('org.ogma.participant.Ministry');

  const factory = getFactory();

  const ministryId = getHash(tx.name + tx.countryCode + tx.email + tx.address1 + tx.state + tx.city );

  let ministry 	= factory.newResource('org.ogma.participant', 'Ministry', ministryId.toString());
  let address 	= factory.newConcept('org.ogma.concept', 'Address');

  ministry.name								    = tx.name;
  ministry.phone 							    = tx.phone;
  ministry.logo								    = tx.logo;
  ministry.email 							    = tx.email;
  ministry.websiteUrl						    = tx.websiteUrl;
  ministry.openingDate 							= tx.openingDate;
  ministry.headFirstName						= tx.headFirstName;
  ministry.headLastName							= tx.headLastName;
  ministry.managerFirstName						= tx.managerFirstName;
  ministry.managerLastName						= tx.managerLastName;

  address.address1 							  	= tx.address1;
  address.address2 							  	= tx.address2;
  address.state 							    = tx.state;
  address.city 								    = tx.city;
  address.countryCode						 	= tx.countryCode;
  address.zip 								    = tx.zip;

  ministry.address 							  	= address;

  await ministryRegistry.add(ministry);
}

/**
 * Update ministry
 * @param {org.ogma.participant.transaction.UpdateMinistry} tx
 * @transaction
 */
async function updateMinistry(tx){
  const ministryRegistry = await getParticipantRegistry('org.ogma.participant.Ministry');

  tx.ministry.name 							    = tx.name;
  tx.ministry.phone 						    = tx.phone;
  tx.ministry.logo 							    = tx.logo;
  tx.ministry.email 						    = tx.email;
  tx.ministry.websiteUrl 						= tx.websiteUrl;
  tx.ministry.openingDate 						= tx.openingDate;
  tx.ministry.headFirstName						= tx.headFirstName;
  tx.ministry.headLastName						= tx.headLastName;
  tx.ministry.managerFirstName					= tx.managerFirstName;
  tx.ministry.managerLastName					= tx.managerLastName;

  tx.ministry.address.address1 					= tx.address1;
  tx.ministry.address.address2 					= tx.address2;
  tx.ministry.address.state 					= tx.state;
  tx.ministry.address.city 						= tx.city;
  tx.ministry.address.countryCode 				= tx.countryCode;
  tx.ministry.address.zip 						= tx.zip;

  await ministryRegistry.update(tx.ministry);
}
