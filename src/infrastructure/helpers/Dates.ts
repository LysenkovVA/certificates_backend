export class Dates {
    static getDateFrom(startDate: Date, addMonths: number) {
        return startDate.setMonth(startDate.getMonth() + addMonths);
    }
}
