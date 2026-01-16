const bookSelect = document.getElementById('bookSelect');
const chapterSelect = document.getElementById('chapterSelect');
const verseSelect = document.getElementById('verseSelect');
const searchBtn = document.getElementById('searchBtn');

// Populate Books
bibleData.forEach((book, index) => {
    const option = document.createElement('option');
    option.value = index; // Store index to access bibleData easily
    option.textContent = book.name;
    bookSelect.appendChild(option);
});

// Handle Book Change
bookSelect.addEventListener('change', () => {
    const bookIndex = bookSelect.value;
    const book = bibleData[bookIndex];
    const isSingleChapter = book.chapters.length === 1;

    // Reset UI
    chapterSelect.innerHTML = '<option value="" disabled selected>Select Chapter</option>';
    verseSelect.innerHTML = '<option value="" disabled selected>-</option>';
    searchBtn.disabled = true;

    if (isSingleChapter) {
        // Hide Chapter Select
        chapterSelect.parentElement.style.display = 'none';

        // Auto-populate Verses for Chapter 1
        verseSelect.disabled = false;
        verseSelect.innerHTML = '<option value="" disabled selected>Select Verse</option>';
        const verseCount = book.chapters[0];
        for (let i = 1; i <= verseCount; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            verseSelect.appendChild(option);
        }
        // Make Verse select full width if desired, or just leave it. 
        // For now, let's leave it in the grid, it will take the first slot.
    } else {
        // Show Chapter Select
        chapterSelect.parentElement.style.display = 'block';
        chapterSelect.disabled = false;
        verseSelect.disabled = true;

        // Populate Chapters
        book.chapters.forEach((verseCount, index) => {
            const option = document.createElement('option');
            option.value = index + 1; // Chapter number (1-based)
            option.textContent = index + 1;
            chapterSelect.appendChild(option);
        });
    }
});

// Handle Chapter Change
chapterSelect.addEventListener('change', () => {
    const bookIndex = bookSelect.value;
    const chapterNum = parseInt(chapterSelect.value);
    const book = bibleData[bookIndex];
    const verseCount = book.chapters[chapterNum - 1];

    // Reset and enable Verse
    verseSelect.innerHTML = '<option value="" disabled selected>Select Verse</option>';
    verseSelect.disabled = false;
    searchBtn.disabled = true;

    // Populate Verses
    for (let i = 1; i <= verseCount; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        verseSelect.appendChild(option);
    }
});

// Handle Verse Change
verseSelect.addEventListener('change', () => {
    searchBtn.disabled = false;
});

// Handle Search
searchBtn.addEventListener('click', () => {
    const bookIndex = parseInt(bookSelect.value);
    const book = bibleData[bookIndex];
    const isSingleChapter = book.chapters.length === 1;

    // Determine Chapter Number (1 if single chapter, else from select)
    const chapterNum = isSingleChapter ? 1 : parseInt(chapterSelect.value);
    const verseNum = parseInt(verseSelect.value);

    // 1. Get verse count for the current chapter
    const verseCount = book.chapters[chapterNum - 1];

    // 2. Calculate distance to start (Verse 1) and end (Last Verse) of the CHAPTER
    const distanceToStart = verseNum - 1;
    const distanceToEnd = verseCount - verseNum;

    // 3. Determine furthest verse in the CHAPTER
    let furthestVerseNum = 0;
    if (distanceToStart > distanceToEnd) {
        // Start is furthest
        furthestVerseNum = 1;
    } else {
        // End is furthest (or equal, default to end)
        furthestVerseNum = verseCount;
    }

    // 4. Construct Query
    let selectedVerseString = "";
    let furthestVerseString = "";

    if (isSingleChapter) {
        // Format: (Jude 3) !(Jude 25)
        selectedVerseString = `${book.name} ${verseNum}`;
        furthestVerseString = `${book.name} ${furthestVerseNum}`;
    } else {
        // Format: (Genesis 1:1) !(Genesis 1:31)
        selectedVerseString = `${book.name} ${chapterNum}:${verseNum}`;
        furthestVerseString = `${book.name} ${chapterNum}:${furthestVerseNum}`;
    }

    const query = `(${selectedVerseString}) !(${furthestVerseString})`;

    // 5. Open WOL
    const encodedQuery = encodeURIComponent(query);
    const url = `https://wol.jw.org/en/wol/s/r1/lp-e?q=${encodedQuery}`;
    window.open(url, '_blank');
});

// Image Search Elements
const imageSearchInput = document.getElementById('imageSearchInput');
const imageSearchBtn = document.getElementById('imageSearchBtn');

// Handle Image Search Button Click
imageSearchBtn.addEventListener('click', () => {
    const searchTerm = imageSearchInput.value.trim();
    if (searchTerm) {
        // Construct Google Images URL with site restriction
        // Using (site:jw.org OR site:wol.jw.org) to include both domains
        const query = `${searchTerm} (site:jw.org OR site:wol.jw.org)`;
        const encodedQuery = encodeURIComponent(query);
        const url = `https://www.google.com/search?q=${encodedQuery}&tbm=isch`;
        window.open(url, '_blank');
    }
});

// Handle Enter key in image search input
imageSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        imageSearchBtn.click();
    }
});
