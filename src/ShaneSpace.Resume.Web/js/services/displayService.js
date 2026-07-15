angular.module('displayService', [])
    .factory('display', [function () {
        var P0_PROFILES = ['linkedin', 'github'];
        var P1_PROFILES = ['stack overflow', 'nuget'];

        function parseYear(date) {
            if (!date) {
                return 0;
            }

            return parseInt(date.substring(0, 4), 10) || 0;
        }

        function formatPrintDate(date) {
            if (!date) {
                return '';
            }

            var year = date.substring(0, 4);
            var month = date.substring(5, 7);

            return month + '/' + year;
        }

        function formatDateRange(startDate, endDate) {
            var start = formatPrintDate(startDate);
            var end = endDate ? formatPrintDate(endDate) : 'Present';

            return start + ' - ' + end;
        }

        function profilePrintPath(profile) {
            var url = profile.url || '';

            return url
                .replace(/^https?:\/\/(www\.)?/i, '')
                .replace(/\/$/, '');
        }

        function formatWebsitePlain(url) {
            if (!url) {
                return '';
            }

            return url
                .replace(/^https?:\/\/(www\.)?/i, '')
                .replace(/\/$/, '');
        }

        function asciiPrint(text) {
            if (text === null || text === undefined) {
                return '';
            }

            return String(text)
                .replace(/\u2014/g, ' - ')
                .replace(/\u2013/g, ' - ')
                .replace(/\u00B7/g, ' | ')
                .replace(/\u2022/g, '-')
                .replace(/\u2026/g, '...')
                .replace(/[\u2018\u2019]/g, '\'')
                .replace(/[\u201C\u201D]/g, '"');
        }

        function inferWorkTier(work) {
            var company = (work.company || '').toLowerCase();

            if (company.indexOf('uber') >= 0) {
                return 'P0';
            }

            if (company.indexOf('lingo') >= 0) {
                return 'P0';
            }

            var startYear = parseYear(work.startDate);

            if (startYear >= 2014) {
                return 'P1';
            }

            if (startYear === 2013 && company.indexOf('birch') >= 0) {
                return 'P1';
            }

            return 'P2';
        }

        function inferWorkGroup(work) {
            var company = (work.company || '').toLowerCase();

            if (company.indexOf('uber') >= 0) {
                return 'uber';
            }

            if (company.indexOf('birch') >= 0 || company.indexOf('cbeyond') >= 0) {
                return 'birch-cbeyond';
            }

            return null;
        }

        function defaultBulletLimit(tier) {
            if (tier === 'P0') {
                return 5;
            }

            if (tier === 'P1') {
                return 3;
            }

            return 0;
        }

        function inferSkillTier(skill) {
            var name = (skill.name || '').toLowerCase();

            if (name.indexOf('applied ai') >= 0 ||
                name.indexOf('backend and distributed') >= 0 ||
                name.indexOf('data and analytics') >= 0 ||
                name.indexOf('devops') >= 0 ||
                name.indexOf('reliability') >= 0) {
                return 'P0';
            }

            if (name.indexOf('web development') >= 0 ||
                name.indexOf('data storage') >= 0 ||
                name.indexOf('testing') >= 0 ||
                name === 'backend') {
                return 'P1';
            }

            return 'P2';
        }

        function inferProfileTier(profile) {
            var network = (profile.network || '').toLowerCase();

            if (P0_PROFILES.indexOf(network) >= 0) {
                return 'P0';
            }

            if (P1_PROFILES.indexOf(network) >= 0) {
                return 'P1';
            }

            return 'P2';
        }

        function inferReferenceTier(reference) {
            var name = (reference.name || '').toLowerCase();

            if (name.indexOf('reference contact') >= 0 || name.indexOf('available upon request') >= 0) {
                return 'P0';
            }

            return 'P2';
        }

        function inferEducationTier(education, index) {
            if (education.displayTier) {
                return education.displayTier;
            }

            return index === 0 ? 'P1' : 'P2';
        }

        function buildSummaryShort(summary, summaryShort) {
            if (summaryShort) {
                return summaryShort;
            }

            if (!summary) {
                return '';
            }

            if (summary.length <= 420) {
                return summary;
            }

            var truncated = summary.substring(0, 420);
            var lastSentence = Math.max(
                truncated.lastIndexOf('. '),
                truncated.lastIndexOf('.\n')
            );

            if (lastSentence > 200) {
                return truncated.substring(0, lastSentence + 1);
            }

            return truncated.trim() + '...';
        }

        function buildSummaryKeywords(resume) {
            if (resume.basics && resume.basics.summaryKeywords) {
                return resume.basics.summaryKeywords;
            }

            var keywords = [];

            angular.forEach(resume.skills, function (skill) {
                if (skill.displayTier === 'Hidden') {
                    return;
                }

                if (skill.displayTier === 'P0' || skill.displayTier === 'P1') {
                    angular.forEach(skill.keywords, function (keyword) {
                        if (keywords.indexOf(keyword) < 0) {
                            keywords.push(keyword);
                        }
                    });
                }
            });

            return keywords.slice(0, 15).join(', ');
        }

        function mergeDuplicateSkills(skills) {
            var backendDistributed = null;
            var duplicateBackend = null;

            angular.forEach(skills, function (skill) {
                var name = (skill.name || '').toLowerCase();

                if (name === 'backend and distributed systems') {
                    backendDistributed = skill;
                }

                if (name === 'backend') {
                    duplicateBackend = skill;
                }
            });

            if (backendDistributed && duplicateBackend) {
                angular.forEach(duplicateBackend.keywords, function (keyword) {
                    if (backendDistributed.keywords.indexOf(keyword) < 0) {
                        backendDistributed.keywords.push(keyword);
                    }
                });

                duplicateBackend.displayTier = 'Hidden';
            }
        }

        function inferProjectTier(project) {
            if (project.displayTier) {
                return project.displayTier;
            }

            return 'P0';
        }

        function applyPrintProfile(resume, profileKey) {
            if (!profileKey || profileKey === 'default' || !resume.printProfiles) {
                return resume;
            }

            var profile = resume.printProfiles[profileKey];

            if (!profile) {
                return resume;
            }

            if (profile.basics) {
                angular.extend(resume.basics, profile.basics);
            }

            if (profile.work) {
                angular.forEach(profile.work, function (override) {
                    angular.forEach(resume.work, function (work) {
                        if (override.company && work.company === override.company &&
                            (!override.position || work.position === override.position)) {
                            angular.extend(work, override);
                        }
                    });
                });
            }

            if (profile.projects) {
                angular.forEach(profile.projects, function (override) {
                    angular.forEach(resume.projects, function (project) {
                        if (override.name && project.name === override.name) {
                            angular.extend(project, override);
                        }
                    });
                });
            }

            return resume;
        }

        function buildWorkRoleEntry(work) {
            var datesLine = formatDateRange(work.startDate, work.endDate);

            if (work.location) {
                datesLine += ' | ' + asciiPrint(work.location);
            }

            return {
                position: asciiPrint(work.position),
                company: asciiPrint(work.company),
                dateRange: formatDateRange(work.startDate, work.endDate),
                datesLine: asciiPrint(datesLine),
                location: asciiPrint(work.location || ''),
                showSummary: work.displayTier === 'P0',
                summary: asciiPrint(work.summary),
                highlights: (work.highlights || []).slice(0, work.printBulletLimit).map(asciiPrint)
            };
        }

        function buildPrintWork(resume) {
            var result = [];
            var visibleWork = [];
            var i;

            angular.forEach(resume.work, function (work) {
                if (work.displayTier !== 'P2') {
                    visibleWork.push(work);
                }
            });

            for (i = 0; i < visibleWork.length; i++) {
                var work = visibleWork[i];

                if (work.displayGroup) {
                    var group = work.displayGroup;
                    var groupedRoles = [];

                    while (i < visibleWork.length && visibleWork[i].displayGroup === group) {
                        groupedRoles.push(visibleWork[i]);
                        i++;
                    }

                    i--;

                    if (groupedRoles.length > 1) {
                        result.push({
                            merged: true,
                            company: asciiPrint(groupedRoles[0].company),
                            roles: groupedRoles.map(buildWorkRoleEntry)
                        });
                    } else {
                        result.push({
                            merged: false,
                            role: buildWorkRoleEntry(groupedRoles[0])
                        });
                    }
                } else {
                    result.push({
                        merged: false,
                        role: buildWorkRoleEntry(work)
                    });
                }
            }

            return result;
        }

        function shortenAwardSummary(summary) {
            if (!summary) {
                return '';
            }

            if (summary.length <= 80) {
                return summary;
            }

            return summary.substring(0, 77).trim() + '...';
        }

        function buildPrintView(resume) {
            var view = {
                label: asciiPrint(resume.basics.label),
                summaryShort: asciiPrint(resume.basics.summaryShort),
                website: formatWebsitePlain(resume.basics.website),
                summaryKeywords: asciiPrint(buildSummaryKeywords(resume)),
                profiles: [],
                work: buildPrintWork(resume),
                earlierExperience: [],
                skills: [],
                skillsAlso: [],
                projects: [],
                education: [],
                awards: [],
                references: []
            };

            angular.forEach(resume.basics.profiles, function (profile) {
                if (profile.displayTier === 'P0' || profile.displayTier === 'P1') {
                    view.profiles.push({
                        network: profile.network,
                        url: profile.url,
                        printPath: profilePrintPath(profile)
                    });
                }
            });

            angular.forEach(resume.work, function (work) {
                if (work.displayTier === 'P2') {
                    view.earlierExperience.push({
                        line: asciiPrint(
                            work.position + ' | ' + work.company + ' | ' +
                            formatDateRange(work.startDate, work.endDate)
                        )
                    });
                }
            });

            angular.forEach(resume.skills, function (skill) {
                if (skill.displayTier === 'Hidden') {
                    return;
                }

                var entry = {
                    name: asciiPrint(skill.name),
                    keywordsText: (skill.keywords || []).map(asciiPrint).join(', ')
                };

                if (skill.displayTier === 'P0') {
                    view.skills.push(entry);
                } else if (skill.displayTier === 'P2') {
                    view.skillsAlso.push(entry);
                }
            });

            angular.forEach(resume.projects, function (project) {
                if (project.displayTier !== 'P0' || project.printExclude) {
                    return;
                }

                var limit = project.printHighlightLimit || 0;

                view.projects.push({
                    name: asciiPrint(project.name),
                    description: asciiPrint(project.description),
                    highlights: limit > 0 ?
                        (project.highlights || []).slice(0, limit).map(asciiPrint) : []
                });
            });

            angular.forEach(resume.education, function (education) {
                if (education.displayTier === 'P2' || education.printExclude) {
                    return;
                }

                view.education.push({
                    line: asciiPrint(
                        education.studyType + ' | ' + education.institution + ' | ' +
                        formatDateRange(education.startDate, education.endDate)
                    )
                });
            });

            if (resume.awards) {
                angular.forEach(resume.awards, function (award) {
                    if (award.displayTier === 'P0') {
                        view.awards.push({
                            line: asciiPrint(
                                award.title + ' | ' + award.awarder + ' (' + parseYear(award.date) + ')'
                            ),
                            summary: asciiPrint(shortenAwardSummary(award.summary))
                        });
                    }
                });
            }

            if (resume.references) {
                angular.forEach(resume.references, function (reference) {
                    if (reference.displayTier === 'P0' && reference.printInclude) {
                        view.references.push({
                            text: asciiPrint(reference.reference)
                        });
                    }
                });
            }

            return view;
        }

        function enrichResume(resume, profileKey) {
            if (!resume) {
                return resume;
            }

            resume = applyPrintProfile(resume, profileKey);

            resume.basics = resume.basics || {};
            resume.basics.summaryShort = buildSummaryShort(
                resume.basics.summary,
                resume.basics.summaryShort
            );

            angular.forEach(resume.basics.profiles, function (profile) {
                profile.displayTier = profile.displayTier || inferProfileTier(profile);
                profile.printPath = profilePrintPath(profile);
            });

            angular.forEach(resume.work, function (work) {
                work.displayTier = work.displayTier || inferWorkTier(work);
                work.displayGroup = work.displayGroup || inferWorkGroup(work);
                work.printBulletLimit = work.printBulletLimit || defaultBulletLimit(work.displayTier);
            });

            angular.forEach(resume.skills, function (skill) {
                skill.displayTier = skill.displayTier || inferSkillTier(skill);
            });

            mergeDuplicateSkills(resume.skills);

            resume.visibleSkills = [];
            angular.forEach(resume.skills, function (skill) {
                if (skill.displayTier !== 'Hidden') {
                    resume.visibleSkills.push(skill);
                }
            });

            angular.forEach(resume.references, function (reference) {
                reference.displayTier = reference.displayTier || inferReferenceTier(reference);
            });

            angular.forEach(resume.education, function (education, index) {
                education.displayTier = education.displayTier || inferEducationTier(education, index);
            });

            if (resume.awards) {
                angular.forEach(resume.awards, function (award) {
                    award.displayTier = award.displayTier || 'P1';
                });
            }

            if (resume.projects) {
                angular.forEach(resume.projects, function (project) {
                    project.displayTier = project.displayTier || inferProjectTier(project);
                    project.printHighlightLimit = project.printHighlightLimit !== undefined ?
                        project.printHighlightLimit : 0;
                });
            }

            return resume;
        }

        return {
            enrich: enrichResume,
            buildPrintView: buildPrintView,
            formatDateRange: formatDateRange,
            applyPrintProfile: applyPrintProfile
        };
    }]);
