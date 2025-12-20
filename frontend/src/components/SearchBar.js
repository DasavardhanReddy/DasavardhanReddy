import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar({ onSearch, placeholder='Search vehicle or driver' }){
  const [q, setQ] = useState('');
  const submit = (e) => {
    e.preventDefault();
    onSearch(q);
  };
  return (
    <form onSubmit={submit} style={{ marginBottom: 12 }}>
      <TextField
        fullWidth
        value={q}
        onChange={e=>setQ(e.target.value)}
        placeholder={placeholder}
        size="small"
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit" edge="end" aria-label="search">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
}
