REPORT=report

all: $(REPORT).pdf mostlyclean

$(REPORT).pdf: $(REPORT).tex bib.bib images/*
	xelatex -shell-escape $(REPORT).tex
	xelatex -shell-escape $(REPORT).tex
	bibtex $(REPORT)
	xelatex -shell-escape $(REPORT).tex
	xelatex -shell-escape $(REPORT).tex

mostlyclean:
	rm -rf _minted-* *.log *.aux *.out *.lof *.lol *.toc *.bbl *.blg

clean:
	rm -rf _minted-* $(REPORT).pdf *.log *.aux *.out *.lof *.lol *.toc *.bbl *.blg

rebuild: clean all
