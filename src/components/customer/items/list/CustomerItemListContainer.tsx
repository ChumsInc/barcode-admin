import styled from "@emotion/styled";
import type {ReactNode} from "react";

const StyledItemListContainer = styled.div`
    .bca--customer-item-list {
        @media screen and (max-width: 900px) {
            tr {
                th,
                td {
                    &:nth-child(1),
                    &:nth-child(2),
                    &:nth-child(3) {
                        display: table-cell;
                    }

                    display: none;
                }
            }
        }
    }
`

export default function CustomerItemListContainer({children}: {
    children: ReactNode;
}) {
    return (
        <StyledItemListContainer>{children}</StyledItemListContainer>
    )
}
