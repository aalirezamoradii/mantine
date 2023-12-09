import { buildPackage } from '../build/build-package';
import { locatePackage } from '../packages/locate-package';
import { getPackageName } from '../packages/get-package-name';
import { publishPackage } from './publish-package';

async function publish() {
  const packageName = getPackageName('dates');
  const packagePath = await locatePackage(packageName) ?? '';

  await buildPackage(packageName);
  await publishPackage({ packagePath, name: packageName, tag: 'latest' });
}

publish();
