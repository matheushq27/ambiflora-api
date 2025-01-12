import { Injectable } from "@nestjs/common";

export interface TPagination {
    previousPage: number | null
    currentPage: number | null
    nextPage: number | null
    totalRecords: number
    totalPage: number | null
}

export interface TakeSkip {
    skip?: number
    take?: number
}

interface PaginateParams {
    total: number
    page: number
}

@Injectable()
export class Pagination {
    private perPage = 1

    paginate(paginate: PaginateParams) {

        const { page, total } = paginate
        const totalPage = Math.ceil(total / this.perPage)

        const currentPage = page;
        const hasPreviousPage = currentPage > 1;
        const hasNextPage = currentPage > 0 && currentPage < totalPage;
        const previousPage = hasPreviousPage ? currentPage - 1 : null;
        const nextPage = hasNextPage ? currentPage + 1 : null;

        return {
            pagination: {
                previousPage,
                currentPage: currentPage > 0 ? currentPage : null,
                nextPage: nextPage === totalPage ? null : nextPage,
                totalRecords: total,
                totalPage: page <= 0 ? null : totalPage
            },
        }
    }
    takeSkip(page: number, paramPerPage?: number) {
        if(paramPerPage){
            this.perPage = paramPerPage
        }
        const skip = (page - 1) * this.perPage
        return {
            take: paramPerPage,
            skip
        }
    }
}
