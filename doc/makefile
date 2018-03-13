CC=xelatex -shell-escape

all: report.pdf first_presentation.pdf second_presentation.pdf mostlyclean

report.pdf: report.tex bib.bib images/*
	$(CC) report.tex
	$(CC) report.tex
	bibtex report
	$(CC) report.tex
	$(CC) report.tex
	make mostlyclean

first_presentation.pdf: first_presentation.tex images/*
	$(CC) first_presentation.tex
	$(CC) first_presentation.tex
	make mostlyclean

second_presentation.pdf: second_presentation.tex images/*
	$(CC) second_presentation.tex
	$(CC) second_presentation.tex
	make mostlyclean

mostlyclean:
	rm -rf _minted-* *.log *.aux *.out *.lof *.lol *.toc *.bbl *.blg *.nav *.snm

clean:
	rm -rf _minted-* *.pdf *.log *.aux *.out *.lof *.lol *.toc *.bbl *.blg *.nav *.snm

rebuild: clean all
