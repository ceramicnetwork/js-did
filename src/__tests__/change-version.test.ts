import { changeVersion } from '../change-version.util'

test('from 0 to CID', () => {
  const kid =
    'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl?version-id=0#dkbnB3Dd1z5wByn'
  const nextVersion = 'bafyreihoahs3ge57ud5kmvs76k2dhuu46fhpilo4r7lol6fuaxh7sxk5nm'
  const result = changeVersion(kid, nextVersion)
  expect(result).toMatchSnapshot()
})

test('from CID to 0', () => {
  const kid =
    'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl?version-id=bafyreihoahs3ge57ud5kmvs76k2dhuu46fhpilo4r7lol6fuaxh7sxk5nm&other=foo#dkbnB3Dd1z5wByn'
  const nextVersion = '0'
  const result = changeVersion(kid, nextVersion)
  expect(result).toMatchSnapshot()
})
