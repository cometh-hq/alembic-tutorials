import { JSX } from "react";
import { Container } from "./Container";
import { Text } from "./Text";

export interface IHeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: IHeaderProps): JSX.Element {
  return (
    <Container>
      <div className="flex items-center h-[80px]">
        <Text content="Alembic Demo" className="font-semibold mr-10" />
        {children}
      </div>
    </Container>
  );
}
