require("./base");
X.queryOf = function (e, maxParent, q) {
    if ((!X.isVal(e) || !X.isEl(e))) {
        X.error(`\nQuery generator's first parameter must be Element/Node! CAUSE: X.queryOf(${e}, ${maxParent})`);
        return null;
    }
    maxParent = maxParent || X.$BODY;
    let gen = e.tagName;
    q = q || "";

    if (e.id) {
        gen += e.id ? ('#' + e.id) : "";
        return gen + (!(q === "") ? ' ' + q : "");
    }

    X.cls(e).items().forEach(function (value) {
        gen = gen + (value !== '' ? '.' + value : '')
    });

    if (gen) {
        let sibs = X.Q(gen, e.parentElement);
        if (sibs.length>1) {
            let idx = Array.from(e.parentElement.children).findIndex(function (i) {
                return e === i;
            });

            if (idx > 0) {
                gen = gen + ":nth-child("+(idx+1)+")";
            }
        }
    }
    if (e.parentElement && (e.parentElement !== maxParent) && e.parentElement !== X.$DOC) {

        return (X.queryOf(e.parentElement) + " > " + gen) + (!(q === "") ? ' ' + q : "");
    } else {
        return gen + (!(q === "") ? ' ' + q : "");
    }
};
