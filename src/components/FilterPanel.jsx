import { useDispatch, useSelector } from "react-redux";
import { setFilter, resetFilters } from "../redux/slices/filterSlice";

const FilterPanel = ({ companies }) => {
  const dispatch = useDispatch();

  const { gender, company } = useSelector((state) => state.filters);

  return (
    <div style={styles.filterRow}>
      <select
        value={gender}
        onChange={(e) =>
          dispatch(setFilter({ gender: e.target.value }))
        }
        style={styles.select}
      >
        <option value="all">All Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <select
  value={company}
  onChange={(e) =>
    dispatch(setFilter({ company: e.target.value }))
  }
  style={styles.select}
>
  <option value="all">All Company</option>

  {companies.map((c, i) => (
    <option key={i} value={c}>
      {c}
    </option>
  ))}
</select>

      <button onClick={() => dispatch(resetFilters())} style={styles.resetBtn}>
        Reset
      </button>
    </div>
  );
};
const styles = {
  filterRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  select: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
    resetBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  },
}
export default FilterPanel;