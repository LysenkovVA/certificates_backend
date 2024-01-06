/**
 * АТТРИБУТЫ ТАБЛИЦ, КОТОРЫЕ ВОЗВРАЩАЮТСЯ В ЗАПРОСАХ
 */

export const berthTypeTableAttributes: Array<string> = ["id", "value"];

export const berthTableAttributes: Array<string> = ["id", "value", "hasRank"];

export const certificateTypeTableAttributes: Array<string> = [
    "id",
    "value",
    "hasGroups",
    "isUnlimited",
];

export const certificateTableAttributes: Array<string> = [
    "id",
    "number",
    "startDate",
    "group",
];

export const checkGroupsTableAttributes: Array<string> = ["id", "value"];

export const constructionObjectsTableAttributes: Array<string> = [
    "id",
    "name",
    "address",
    "startDate",
    "endDate",
];

export const departmentTableAttributes: Array<string> = ["id", "name"];

export const employeeTableAttributes: Array<string> = [
    "id",
    "surname",
    "name",
    "hireDate",
    "dismissDate",
    "rank",
    "phone",
    "email",
];

export const fileTableAttributes: Array<string> = [
    "id",
    "name",
    "path",
    "format",
    "sizeAtBytes",
];

export const inspectionTypeTableAttributes: Array<string> = ["id", "value"];

export const inspectionViolationTableAttributes: Array<string> = [
    "id",
    "termOfElimination",
    "isEliminated",
];

export const inspectionTableAttributes: Array<string> = [
    "id",
    "date",
    "isPenalty",
    "isCommitional",
    "dateOfElimination",
    "documentNumber",
    "documentDate",
    "notes",
];

export const profileTableAttributes: Array<string> = [
    "id",
    "surname",
    "name",
    "birthDate",
];

export const resultDocumentTypeTableAttributes: Array<string> = ["id", "value"];

export const roleTableAttributes: Array<string> = [
    "id",
    "value",
    "description",
];

export const subscriptionTableAttributes: Array<string> = [
    "id",
    "value",
    "description",
    "pricePerMonth",
    "teamMembersCount",
    "organizationsCount",
];

export const tokenTableAttributes: Array<string> = ["id", "refreshToken"];

export const workspaceTableAttributes: Array<string> = ["id", "name"];

export const userTableAttributes: Array<string> = ["id", "email", "password"]; //

export const violationCommentTableAttributes: Array<string> = ["id", "value"];

export const violationEmployeeCommentTableAttributes: Array<string> = [
    "id",
    "value",
    "date",
];
