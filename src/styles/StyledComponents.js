import styled from 'styled-components';

// Existing styled components you already have
export const ActionButton = styled.button`
  padding: 8px 12px;
  background-color: #007bff;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background-color: #0056b3;
  }
`;



export const Heading = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
  text-align: center; /* ✅ Add this */
`;
export const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
  align-items: center;
`;
export const InvoiceContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 6px;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
`;

export const InvoiceSummaryStyled = styled.div`
  margin-top: 2rem;
  font-weight: bold;
  font-size: 1.2rem;
  text-align: right;
`;

export const ProductInput = styled.input`
  flex: 1;
  min-width: 140px;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: ${({ readOnly }) => (readOnly ? '#f5f5f5' : '#fff')};
`;

export const ProductTableStyled = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  th {
    background-color: #f2f2f2;
  }
`;

// Additional styled components

export const HeaderContainer = styled.header`
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 20px 30px;
  text-align: center;
  border-bottom: 2px solid #34495e;

  h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: bold;
  }

  p {
    margin: 5px 0 0 0;
    font-size: 1rem;
    color: #bdc3c7;
  }
`;

export const FooterContainer = styled.footer`
  background-color: #222;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: 2rem;
`;


export const AddButton = styled.button`
  padding: 8px 14px;
  background-color: #28a745;
  border: none;
  color: white;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background-color: #1e7e34;
  }
`;

export const SidebarContainer = styled.aside`
  width: ${({ isOpen }) => (isOpen ? "250px" : "60px")};
  background-color: #333;
  color: white;
  height: 100vh;
  padding: 1rem 0.5rem;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  transition: width 0.3s ease;
`;
export const ResponsiveForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const SidebarToggle = styled.button`
  background-color: #444;
  border: none;
  color: white;
  padding: 0.5rem;
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #555;
  }
`;

export const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
`;

export const SidebarMenuItem = styled.li`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #555;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }
`;
export const AutocompleteWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
`;

export const AutocompleteInput = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 160px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  z-index: 10;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const SuggestionItem = styled.li`
  padding: 8px;
  cursor: pointer;

  &:hover, &.active {
    background-color: #007bff;
    color: white;
  }
`;
