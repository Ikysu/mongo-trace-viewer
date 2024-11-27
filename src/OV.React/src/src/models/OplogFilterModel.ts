export interface OplogFilterModel {
    database: string | "";
    collection: string | "";
    recordId: string | "";
    specialQuery: string | "";
    filterId: string | "";
    startDate: Date | null;
    endDate: Date | null;
}